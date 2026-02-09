/** 메뉴/음식 정보 */
export interface Food {
  /** 음식명 */
  name: string;
  /** 가격 (원) */
  price: number;
  /** 설명 */
  desc: string;
  /** 대표음식 여부 */
  isBest: boolean;
  /** 추천메뉴 여부 */
  isRecommend: boolean;
}

/** 편의시설 정보 */
export interface Facility {
  /** 시설명 */
  name: string;
  /** 시설 설명 */
  desc: string;
  /** 운영 시작시간 */
  openTime: string;
  /** 운영 종료시간 */
  closeTime: string;
}

/** 브랜드 매장 */
export interface BrandShop {
  name: string;
  category: string;
}

/** 휴게소 기본 정보 */
export interface RestArea {
  /** 휴게소 고유 코드 */
  code: string;
  /** 휴게소명 */
  name: string;
  /** URL 슬러그 */
  slug: string;
  /** 고속도로 노선명 */
  highway: string;
  /** 고속도로 슬러그 */
  highwaySlug: string;
  /** 방향 (예: 부산, 서울) */
  direction: string;
  /** 도로명주소 */
  address: string;
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
  /** 전화번호 */
  tel: string;
  /** 휴게소 종류 (일반휴게소, 간이휴게소, 화물차휴게소) */
  type: string;
  /** 운영시간 시작 */
  openTime: string;
  /** 운영시간 종료 */
  closeTime: string;
  /** 대표 음식 */
  bestFood: string;
  /** 주차 면수 */
  parkingCount: number;
  /** 주유소 유무 */
  hasGasStation: boolean;
  /** LPG 충전소 유무 */
  hasLpg: boolean;
  /** 전기차 충전소 유무 */
  hasEvCharger: boolean;
  /** 수유실 유무 */
  hasNursingRoom: boolean;
  /** 약국 유무 */
  hasPharmacy: boolean;
  /** 샤워실 유무 */
  hasShower: boolean;
  /** 화장실 유무 */
  hasRestroom: boolean;
  /** 매점 유무 */
  hasStore: boolean;
  /** 음식점 유무 */
  hasRestaurant: boolean;
  /** 브랜드 매장 목록 */
  brands: BrandShop[];
  /** 메뉴/음식 목록 */
  foods: Food[];
  /** 편의시설 상세 */
  facilities: Facility[];
}

/** 고속도로 노선 유형 */
export type HighwayType = '간선고속도로' | '순환고속도로' | '지선고속도로' | '기타고속도로';

/** 고속도로 유형별 라벨 및 설명 */
export const HIGHWAY_TYPE_META: Record<HighwayType, { label: string; desc: string }> = {
  '간선고속도로': { label: '간선고속도로', desc: '주요 도시를 연결하는 기간 노선' },
  '순환고속도로': { label: '순환고속도로', desc: '수도권 및 도시 외곽을 순환하는 노선' },
  '지선고속도로': { label: '지선고속도로', desc: '간선에서 분기하여 연결하는 노선' },
  '기타고속도로': { label: '기타고속도로', desc: '기타 고속도로 노선' },
};

/** 고속도로 정보 */
export interface Highway {
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

/** 메타데이터 */
export interface Metadata {
  lastUpdated: string;
  restAreaCount: number;
  highwayCount: number;
  totalFoods: number;
  totalBrands: number;
  totalFacilities: number;
  apiSource: string;
  apiKey: string;
}
