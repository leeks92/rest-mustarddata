/**
 * 고속도로 휴게소 데이터 수집 스크립트
 * 
 * 데이터 소스: 한국도로공사 공공데이터 포털 (data.ex.co.kr)
 * API Key: 6751538447
 * 
 * 사용 API:
 * 1. locationinfo/locationinfoRest - 휴게소 기준정보 (위치, 노선)
 * 2. restinfo/restBestfoodList    - 대표음식/메뉴 목록
 * 3. restinfo/restBrandList       - 브랜드 매장 현황
 * 4. restinfo/restConvList        - 편의시설 현황
 * 
 * 사용법: npm run fetch-data
 */

import * as fs from 'fs';
import * as path from 'path';
import { slugify } from 'transliteration';

const API_KEY = '6751538447';
const BASE_URL = 'https://data.ex.co.kr/openapi';
const DATA_DIR = path.join(process.cwd(), 'data');
const PER_PAGE = 99; // 도로공사 API 최대 99건/페이지

// ===== 유틸 =====

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function saveJson(filename: string, data: unknown): void {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
  console.log(`✅ ${filename} 저장 완료`);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toSlug(name: string): string {
  // 한글을 로마자로 변환 후 URL-safe 슬러그 생성
  return slugify(name, { separator: '-', lowercase: true })
    .replace(/[()]/g, '')
    .replace(/\./g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseDirection(unitName: string): string {
  // "서울만남(부산)휴게소" -> "부산"
  const match = unitName.match(/\(([^)]+)\)/);
  return match ? match[1] : '';
}

function cleanName(unitName: string): string {
  // "서울만남(부산)휴게소" -> "서울만남"
  return unitName
    .replace(/\([^)]*\)/, '')
    .replace(/휴게소$/, '')
    .replace(/주유소$/, '')
    .trim();
}

// ===== API 호출 (페이지네이션 지원) =====

interface ExApiResponse {
  code: string;
  message: string;
  count?: number;
  list: Record<string, unknown>[];
  pageNo: number;
  numOfRows: number;
  pageSize: number;
}

async function fetchAllPages<T>(endpoint: string, extraParams: string = ''): Promise<T[]> {
  const all: T[] = [];
  let page = 1;

  while (true) {
    const url = `${BASE_URL}/${endpoint}?key=${API_KEY}&type=json&numOfRows=${PER_PAGE}&pageNo=${page}${extraParams}`;
    
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const text = await response.text();
      
      if (!text.trim().startsWith('{')) {
        console.error(`  ⚠️ 페이지 ${page}: HTML 응답 (API 오류)`);
        break;
      }

      const data: ExApiResponse = JSON.parse(text);
      
      if (data.code !== 'SUCCESS') {
        console.error(`  ⚠️ 페이지 ${page}: ${data.message}`);
        break;
      }

      if (!data.list || data.list.length === 0) break;
      
      all.push(...(data.list as unknown as T[]));
      console.log(`  페이지 ${page}: ${data.list.length}건 (누적 ${all.length}/${data.count || '?'}건)`);

      if (all.length >= (data.count || Infinity)) break;
      if (data.list.length < PER_PAGE) break;
      
      page++;
      await delay(500); // Rate limiting
    } catch (error) {
      console.error(`  ❌ 페이지 ${page} 실패:`, error);
      break;
    }
  }

  return all;
}

// ===== API 응답 타입 =====

interface RawLocationInfo {
  unitName: string;      // 휴게소명 (예: "서울만남(부산)휴게소")
  unitCode: string;      // 휴게소코드
  routeName: string;     // 노선명 (예: "경부선")
  routeNo: string;       // 노선코드
  xValue: string;        // 경도 (lng)
  yValue: string;        // 위도 (lat)
  stdRestCd: string;     // 표준휴게소코드
  serviceAreaCode: string; // 영업부대시설코드
}

interface RawBestFood {
  stdRestCd: string;
  stdRestNm: string;     // 휴게소명
  routeCd: string;
  routeNm: string;       // 노선명
  svarAddr: string;      // 주소
  foodNm: string;        // 음식명
  foodCost: string;      // 가격
  etc: string;           // 설명
  recommendyn: string;   // 추천여부
  bestfoodyn: string;    // 대표음식여부
  premiumyn: string;     // 프리미엄여부
  seasonMenu: string;    // 계절메뉴
  foodMaterial: string;  // 재료
  restCd: string;
  seq: string;
}

interface RawBrand {
  stdRestCd: string;
  stdRestNm: string;     // 휴게소명
  routeCd: string;
  routeNm: string;       // 노선명
  svarAddr: string;      // 주소
  brdCode: string;       // 브랜드코드
  brdName: string;       // 브랜드명
  brdDesc: string;       // 브랜드 설명
  stime: string;         // 영업시작시간
  etime: string;         // 영업종료시간
}

interface RawConvenience {
  stdRestCd: string;
  stdRestNm: string;     // 휴게소명
  routeCd: string;
  routeNm: string;       // 노선명
  svarAddr: string;      // 주소
  psCode: string;        // 편의시설코드
  psName: string;        // 편의시설명
  psDesc: string;        // 편의시설 설명
  stime: string;         // 운영시작시간
  etime: string;         // 운영종료시간
}

// ===== 최종 데이터 타입 =====

interface RestAreaData {
  code: string;
  name: string;
  slug: string;
  highway: string;
  highwaySlug: string;
  direction: string;
  address: string;
  lat: number;
  lng: number;
  tel: string;
  type: string;
  openTime: string;
  closeTime: string;
  bestFood: string;
  parkingCount: number;
  hasGasStation: boolean;
  hasLpg: boolean;
  hasEvCharger: boolean;
  hasNursingRoom: boolean;
  hasPharmacy: boolean;
  hasShower: boolean;
  hasRestroom: boolean;
  hasStore: boolean;
  hasRestaurant: boolean;
  brands: { name: string; category: string }[];
  foods: { name: string; price: number; desc: string; isBest: boolean; isRecommend: boolean }[];
  facilities: { name: string; desc: string; openTime: string; closeTime: string }[];
}

type HighwayType = '간선고속도로' | '순환고속도로' | '지선고속도로' | '기타고속도로';

/** 고속도로 이름으로 노선 유형 자동 분류 */
function classifyHighwayType(name: string): HighwayType {
  // 순환 노선
  if (name.includes('순환')) return '순환고속도로';

  // 지선 노선
  if (name.includes('지선')) return '지선고속도로';

  // 간선 노선 (주요 노선 명시)
  const mainHighways = [
    '경부선', '서해안선', '영동선', '호남선', '중앙선', '중부선',
    '중부내륙선', '남해선', '통영대전선', '동해선', '순천완주선',
  ];
  for (const main of mainHighways) {
    if (name.includes(main.replace('선', ''))) return '간선고속도로';
  }

  // 이름에 '선'으로 끝나면서 위 목록에 없으면 기타
  return '기타고속도로';
}

interface HighwayData {
  name: string;
  slug: string;
  highwayType: HighwayType;
  restAreas: {
    name: string;
    slug: string;
    direction: string;
    bestFood: string;
    type: string;
  }[];
}

// ===== 메인 로직 =====

async function main() {
  console.log('🚗 고속도로 휴게소 데이터 수집 시작');
  console.log(`   API Key: ${API_KEY}`);
  console.log(`   Base URL: ${BASE_URL}\n`);
  
  ensureDataDir();

  // 1. 휴게소 기준정보 수집
  console.log('📡 [1/4] 휴게소 기준정보 조회...');
  const locationData = await fetchAllPages<RawLocationInfo>('locationinfo/locationinfoRest');
  console.log(`   → 총 ${locationData.length}개 휴게소\n`);

  if (locationData.length === 0) {
    console.error('❌ 기준정보 조회 실패. 종료합니다.');
    process.exit(1);
  }

  // 2. 대표음식/메뉴 수집
  console.log('📡 [2/4] 메뉴/대표음식 조회...');
  const foodData = await fetchAllPages<RawBestFood>('restinfo/restBestfoodList');
  console.log(`   → 총 ${foodData.length}개 메뉴\n`);

  // 3. 브랜드 매장 수집
  console.log('📡 [3/4] 브랜드 매장 조회...');
  const brandData = await fetchAllPages<RawBrand>('restinfo/restBrandList');
  console.log(`   → 총 ${brandData.length}개 브랜드\n`);

  // 4. 편의시설 수집
  console.log('📡 [4/4] 편의시설 조회...');
  const convData = await fetchAllPages<RawConvenience>('restinfo/restConvList');
  console.log(`   → 총 ${convData.length}개 편의시설\n`);

  // ===== 데이터 변환 =====
  console.log('🔄 데이터 변환 중...');

  // 메뉴를 휴게소코드별로 그룹핑
  const foodMap = new Map<string, RawBestFood[]>();
  for (const food of foodData) {
    const key = food.stdRestCd;
    if (!foodMap.has(key)) foodMap.set(key, []);
    foodMap.get(key)!.push(food);
  }

  // 브랜드를 휴게소코드별로 그룹핑
  const brandMap = new Map<string, RawBrand[]>();
  for (const brand of brandData) {
    const key = brand.stdRestCd;
    if (!brandMap.has(key)) brandMap.set(key, []);
    brandMap.get(key)!.push(brand);
  }

  // 편의시설을 휴게소코드별로 그룹핑
  const convMap = new Map<string, RawConvenience[]>();
  for (const conv of convData) {
    const key = conv.stdRestCd;
    if (!convMap.has(key)) convMap.set(key, []);
    convMap.get(key)!.push(conv);
  }

  // 주유소 코드 필터링 (unitName이 "주유소"로 끝나는 경우 제외)
  const restAreaLocations = locationData.filter(
    loc => !loc.unitName.includes('주유소') && !loc.unitName.includes('LPG')
  );

  // 데이터 변환
  const restAreas: RestAreaData[] = [];
  const highwayMap = new Map<string, HighwayData>();
  const usedSlugs = new Set<string>();

  for (const loc of restAreaLocations) {
    const direction = parseDirection(loc.unitName);
    const displayName = cleanName(loc.unitName);
    
    // 슬러그 생성 (방향 포함)
    let slug = toSlug(direction ? `${displayName}-${direction}` : displayName);
    // 중복 방지
    if (usedSlugs.has(slug)) {
      slug = toSlug(`${displayName}-${direction}-${loc.unitCode}`);
    }
    usedSlugs.add(slug);

    const hwName = loc.routeName || '기타';
    const hwSlug = toSlug(hwName.replace(/선$/, ''));

    // 해당 휴게소의 음식 데이터
    const foods = (foodMap.get(loc.stdRestCd) || []).map(f => ({
      name: f.foodNm || '',
      price: parseInt(f.foodCost) || 0,
      desc: (f.etc || '').trim(),
      isBest: f.bestfoodyn === 'Y',
      isRecommend: f.recommendyn === 'Y',
    }));

    // 대표음식 찾기
    const bestFoodItem = foods.find(f => f.isBest) || foods.find(f => f.isRecommend) || foods[0];
    const bestFood = bestFoodItem?.name || '';

    // 브랜드 데이터
    const brands = (brandMap.get(loc.stdRestCd) || []).map(b => ({
      name: b.brdName || '',
      category: b.brdDesc || '',
    }));

    // 편의시설 데이터  
    const facilities = (convMap.get(loc.stdRestCd) || []).map(c => ({
      name: c.psName || '',
      desc: (c.psDesc || '').trim(),
      openTime: c.stime || '',
      closeTime: c.etime || '',
    }));

    // 편의시설 유무 판단
    const facilityNames = facilities.map(f => f.name);
    const hasNursingRoom = facilityNames.includes('수유실');
    const hasPharmacy = facilityNames.includes('약국');
    const hasShower = facilityNames.includes('샤워실');
    const hasStore = facilityNames.includes('편의점') || facilityNames.includes('내고장특산물');
    const hasATM = facilityNames.includes('ATM');
    const hasSleepRoom = facilityNames.includes('수면실');

    // 주소 (편의시설이나 브랜드 데이터에서 가져오기)
    const firstFood = foodMap.get(loc.stdRestCd)?.[0];
    const firstBrand = brandMap.get(loc.stdRestCd)?.[0];
    const firstConv = convMap.get(loc.stdRestCd)?.[0];
    const address = firstFood?.svarAddr || firstBrand?.svarAddr || firstConv?.svarAddr || '';

    // 운영시간 (편의시설에서 가져오기)
    const mainFacility = facilities.find(f => f.name === '쉼터') || facilities[0];
    const openTime = mainFacility?.openTime || '00:00';
    const closeTime = mainFacility?.closeTime || '24:00';

    const area: RestAreaData = {
      code: loc.stdRestCd,
      name: displayName,
      slug,
      highway: hwName,
      highwaySlug: hwSlug,
      direction,
      address,
      lat: parseFloat(loc.yValue) || 0,
      lng: parseFloat(loc.xValue) || 0,
      tel: '',
      type: '일반휴게소',
      openTime,
      closeTime,
      bestFood,
      parkingCount: 0,
      hasGasStation: false,
      hasLpg: false,
      hasEvCharger: false,
      hasNursingRoom,
      hasPharmacy,
      hasShower,
      hasRestroom: true,
      hasStore,
      hasRestaurant: foods.length > 0,
      brands,
      foods: foods.slice(0, 30), // 최대 30개 메뉴
      facilities,
    };

    restAreas.push(area);

    // 고속도로별 그룹핑
    if (!highwayMap.has(hwSlug)) {
      highwayMap.set(hwSlug, {
        name: hwName,
        slug: hwSlug,
        highwayType: classifyHighwayType(hwName),
        restAreas: [],
      });
    }
    highwayMap.get(hwSlug)!.restAreas.push({
      name: area.name,
      slug: area.slug,
      direction: area.direction,
      bestFood: area.bestFood,
      type: area.type,
    });
  }

  const highways = Array.from(highwayMap.values()).sort(
    (a, b) => b.restAreas.length - a.restAreas.length
  );

  // ===== 저장 =====
  saveJson('rest-areas.json', restAreas);
  saveJson('highways.json', highways);
  saveJson('metadata.json', {
    lastUpdated: new Date().toISOString(),
    restAreaCount: restAreas.length,
    highwayCount: highways.length,
    totalFoods: foodData.length,
    totalBrands: brandData.length,
    totalFacilities: convData.length,
    apiSource: 'data.ex.co.kr',
    apiKey: API_KEY,
  });

  console.log(`\n🎉 데이터 수집 완료!`);
  console.log(`   휴게소: ${restAreas.length}개`);
  console.log(`   고속도로: ${highways.length}개`);
  console.log(`   메뉴: ${foodData.length}개`);
  console.log(`   브랜드: ${brandData.length}개`);
  console.log(`   편의시설: ${convData.length}개`);
}

main().catch(console.error);
