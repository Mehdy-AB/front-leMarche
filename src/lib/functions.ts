import { FilterDto } from "@/lib/validation/all.schema";
import { filterDtoSchema } from "@/lib/validation/all.schema";

function isEmpty(val: any): boolean {
  return (
    val === undefined ||
    val === null ||
    (typeof val === "string" && val.trim() === "") ||
    (Array.isArray(val) && val.length === 0) ||
    (typeof val === "object" && val !== null && Object.keys(val).length === 0)
  );
}

export function filterToQueryParams(filter: FilterDto): string {
  const params = new URLSearchParams();

  if (!isEmpty(filter.search)) params.set("search", filter.search!);
  if (!isEmpty(filter.minPrice)) params.set("minPrice", String(filter.minPrice));
  if (!isEmpty(filter.maxPrice)) params.set("maxPrice", String(filter.maxPrice));
  if (!isEmpty(filter.tri)) params.set("tri", filter.tri!);

  // Locations
  filter.locationIds?.forEach((loc, idx) => {
    if (!isEmpty(loc.id) && !isEmpty(loc.type)) {
      params.set(`locationIds[${idx}].id`, String(loc.id));
      params.set(`locationIds[${idx}].type`, loc.type);
      params.set(`locationIds[${idx}].name`, loc.name);
    }
  });

  // Type ID
  if (!isEmpty(filter.type?.id)) {
    params.set("type.id", String(filter.type!.id));
  }

  // Brands and Modeles
  filter.type?.brand?.forEach((brand, bIdx) => {
    if (isEmpty(brand.id)) return;
    params.set(`type.brand[${bIdx}].id`, String(brand.id));

    if (Array.isArray(brand.modeles) && brand.modeles.length > 0) {
      brand.modeles.forEach((modelId, mIdx) => {
        if (!isEmpty(modelId)) {
          params.set(`type.brand[${bIdx}].modeles[${mIdx}]`, String(modelId));
        }
      });
    }
  });

  // Attributes
  filter.attributes?.forEach((attr, aIdx) => {
    if (isEmpty(attr.attributeId)||isEmpty(attr.value)) return;
  
    const { value } = attr;
  
    // Skip arrays if empty, or range objects if both min and max are empty
    if (
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" &&
        !Array.isArray(value) &&
        (value.min === undefined || value.min === null) &&
        (value.max === undefined || value.max === null))
    ) {
      return;
    }
  
    params.set(`attributes[${aIdx}].attributeId`, String(attr.attributeId));
  
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (!isEmpty(v)) {
          params.set(`attributes[${aIdx}].value[${i}]`, String(v));
        }
      });
    } else if (typeof value === "object" && value !== null) {
      if (!isEmpty(value.min)) {
        params.set(`attributes[${aIdx}].value.min`, String(value.min));
      }
      if (!isEmpty(value.max)) {
        params.set(`attributes[${aIdx}].value.max`, String(value.max));
      }
    }
  });
  return params.toString();
}

export function cleanFilterDto(filter: FilterDto): FilterDto {
  const cleaned: any = {};

  if (filter.search) cleaned.search = filter.search;
  if (filter.minPrice != null) cleaned.minPrice = filter.minPrice;
  if (filter.maxPrice != null) cleaned.maxPrice = filter.maxPrice;
  if (filter.tri) cleaned.tri = filter.tri;

  if (filter.locationIds?.length) {
    cleaned.locationIds = filter.locationIds.filter(
      (loc) => loc.id !== undefined && loc.type !== undefined && loc.name !== undefined
    );
  }

  if (filter.type?.id !== undefined) {
    cleaned.type = { id: filter.type.id };

    if (filter.type.brand?.length) {
      const validBrands = filter.type.brand
        .map((b) => {
          const modeles = b.modeles?.filter((m) => m !== undefined && m !== null);
          if (b.id !== undefined || (modeles && modeles.length > 0)) {
            return { id: b.id, modeles };
          }
          return null;
        })
        .filter((b) => b !== null);
      if (validBrands.length > 0) {
        cleaned.type.brand = validBrands as any;
      }
    }
  }

  if (filter.attributes?.length) {
    const validAttrs = filter.attributes
      .map((attr) => {
        if (attr.attributeId === undefined) return null;

        const val = attr.value;

        if (Array.isArray(val)) {
          const nonEmpty = val.filter((v) => v !== undefined && v !== null);
          return nonEmpty.length ? { attributeId: attr.attributeId, value: nonEmpty } : null;
        } else if (val && typeof val === "object") {
          const hasMin = val.min != null;
          const hasMax = val.max != null;

          if (hasMin || hasMax) {
            return {
              attributeId: attr.attributeId,
              value: {
                ...(hasMin ? { min: val.min } : {}),
                ...(hasMax ? { max: val.max } : {}),
              },
            };
          }
        }

        return null;
      })
      .filter((v) => v !== null);

    if (validAttrs.length > 0) {
      cleaned.attributes = validAttrs as any;
    }
  }

  return cleaned;
}
export function removeEmptyValues<T>(obj: T): Partial<T> {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => removeEmptyValues(item))
      .filter((item) => !isEmpty(item)) as unknown as Partial<T>;
  }

  if (typeof obj === "object" && obj !== null) {
    const cleaned: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = removeEmptyValues(value);
      if (!isEmpty(cleanedValue)) {
        cleaned[key] = cleanedValue;
      }
    });
    return cleaned;
  }

  return obj;
}


export function filterFromQueryParams(searchParams: URLSearchParams) {
  const obj: any = {};

  if (searchParams.has("search")) obj.search = searchParams.get("search");
  if (searchParams.has("page")) obj.page = Number(searchParams.get("page"));
  if (searchParams.has("minPrice")) obj.minPrice = Number(searchParams.get("minPrice")||undefined);
  if (searchParams.has("maxPrice")) obj.maxPrice = Number(searchParams.get("maxPrice")||undefined);
  if (searchParams.has("tri")) obj.tri = searchParams.get("tri");

  // Locations
  const locationIds: any[] = [];
  for (let i = 0; ; i++) {
    const id = searchParams.get(`locationIds[${i}].id`);
    const type = searchParams.get(`locationIds[${i}].type`);
    const name = searchParams.get(`locationIds[${i}].name`);
    if (id && type&&name) {
      locationIds.push({ id: Number(id), type ,name});
    } else {
      break;
    }
  }
  if (locationIds.length > 0) obj.locationIds = locationIds;

  // Type
  const typeId = searchParams.get("type.id");
  if (typeId) obj.type = { id: Number(typeId) };

  // Brands and models
  const brandMap: Record<number, { id: number; modeles?: number[] }> = {};
  for (const [key, val] of searchParams.entries()) {
    const brandMatch = key.match(/^type\.brand\[(\d+)\]\.id$/);
    const modelMatch = key.match(/^type\.brand\[(\d+)\]\.modeles\[(\d+)\]$/);
    if (brandMatch) {
      const idx = Number(brandMatch[1]);
      if (!brandMap[idx]) brandMap[idx] = { id: Number(val) };
      else brandMap[idx].id = Number(val);
    }
    if (modelMatch) {
      const bIdx = Number(modelMatch[1]);
      const modelId = Number(val);
      if (!brandMap[bIdx]) brandMap[bIdx] = { id: 0, modeles: [modelId] };
      else brandMap[bIdx].modeles = [...(brandMap[bIdx].modeles || []), modelId];
    }
  }
  if (Object.keys(brandMap).length > 0) {
    obj.type = { ...obj.type, brand: Object.values(brandMap) };
  }

  // Attributes
  const attributesMap: Record<number, any> = {};
  for (const [key, val] of searchParams.entries()) {
    const attrMatch = key.match(/^attributes\[(\d+)\]\.attributeId$/);
    const valueMatch = key.match(/^attributes\[(\d+)\]\.value\[(\d+)\]$/);
    const minMatch = key.match(/^attributes\[(\d+)\]\.value\.min$/);
    const maxMatch = key.match(/^attributes\[(\d+)\]\.value\.max$/);

    if (attrMatch) {
      const idx = Number(attrMatch[1]);
      if (!attributesMap[idx]) attributesMap[idx] = {};
      attributesMap[idx].attributeId = Number(val);
    }

    if (valueMatch) {
      const idx = Number(valueMatch[1]);
      if (!attributesMap[idx]) attributesMap[idx] = { attributeId: 0 };
      if (!Array.isArray(attributesMap[idx].value)) {
        attributesMap[idx].value = [];
      }
      attributesMap[idx].value.push(Number(val));
    }

    if (minMatch) {
      const idx = Number(minMatch[1]);
      if (!attributesMap[idx]) attributesMap[idx] = { attributeId: 0 };
      if (typeof attributesMap[idx].value !== 'object' || Array.isArray(attributesMap[idx].value)) {
        attributesMap[idx].value = {};
      }
      attributesMap[idx].value.min = Number(val)||undefined;
    }

    if (maxMatch) {
      const idx = Number(maxMatch[1]);
      if (!attributesMap[idx]) attributesMap[idx] = { attributeId: 0 };
      if (typeof attributesMap[idx].value !== 'object' || Array.isArray(attributesMap[idx].value)) {
        attributesMap[idx].value = {};
      }
      attributesMap[idx].value.max = Number(val)||undefined;
    }
  }

  if (Object.keys(attributesMap).length > 0) {
    obj.attributes = Object.values(attributesMap);
  }

  try {
    return filterDtoSchema.parse(obj);
  } catch (err) {
    return null;
  }
}


