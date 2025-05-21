import { cleanFilterDto } from "../functions";
import { Ads, Attribute, brands,User, categories, category, cities, department, modeles, OneAdType, region, types, SiretInfo } from "../types/types";
import { FilterDto } from "../validation/all.schema";
import axiosGhost from "./axiosGhost";


export async function getSiret(siret: string): Promise<SiretInfo | null> {
  try {
    const res = await axiosGhost.get(`/user/auth/siret?siret=${siret}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getAllCategories(): Promise<categories | null> {
  try {
    const res = await axiosGhost.get('/ghost/getAllCategories');
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getCategoryByname(name: string): Promise<category | null> {
  try {
    const res = await axiosGhost.get(`/ghost/getCategoryByname/${name}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getTypesByname(categoryname: string): Promise<types | null> {
  try {
    const res = await axiosGhost.get(`/ghost/getCategoryByname/${categoryname}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getTypesByid(categoryid: number): Promise<types | null> {
  try {
    const res = await axiosGhost.get(`/ghost/getCategoryByid/${categoryid}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getBrandsByid(typeid: number): Promise<brands | null> {
  try {
    const res = await axiosGhost.get(`/ghost/gettypeById/${typeid}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getcategoryTypeIdsBytype(typename: string): Promise<{ id: number, categoryId: number } | null> {
  try {
    const res = await axiosGhost.get(`/ghost/gettypeAndCategoryByName/${typename}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getBrandsByname(typename: string): Promise<brands | null> {
  try {
    const res = await axiosGhost.get(`/ghost/gettypeByName/${typename}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getModelesByid(typeid: number[] | number): Promise<modeles | null> {
  try {
    const res = await axiosGhost.get(`/ghost/getBrandById/${typeid}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getModelesByname(typename: string): Promise<modeles | null> {
  try {
    const res = await axiosGhost.get(`/ghost/getBrandByName/${typename}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getAttributes(typeId: number): Promise<Attribute | null> {
  try {
    const res = await axiosGhost.get(`/ghost/getattributesType/${typeId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getRegions(): Promise<region | null> {
  try {
    const res = await axiosGhost.get('/ghost/getregions');
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function searchLocation(name: string): Promise<{ departments: department, regions: region, cities: cities } | null> {
  try {
    const res = await axiosGhost.get(`/ghost/getLocations/${name}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getDepartments(regionId: number): Promise<department | null> {
  try {
    const res = await axiosGhost.get(`/ghost/getDepartments/${regionId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getCities(departmentId: number): Promise<cities | null> {
  try {
    const res = await axiosGhost.get(`/ghost/getCities/${departmentId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getUser(id: number): Promise<User | null> {
  try {
    const res = await axiosGhost.get(`/ghost/user/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getUserFollowers(id: number, take: number, skip: number) {
  try {
    const res = await axiosGhost.get(`/ghost/getUserFollowers/${id}?take=${take}&skip=${skip* 32}`);
    return res.data;
  } catch (err) {
    console.error('getUserFollowers:', err);
    return null;
  }
}

export async function getUserFollowing(id: number, take: number, skip: number) {
  try {
    const res = await axiosGhost.get(`/ghost/getUserFollowing/${id}?take=${take}&skip=${skip* 32}`);
    return res.data;
  } catch (err) {
    console.error('getUserFollowing:', err);
    return null;
  }
}

export async function getUserAds(id: number, filter: FilterDto|null, take: number, skip: number): Promise<Ads | null> {
  try {
    const clean  =cleanFilterDto(filter??{})
    const res = await axiosGhost.post(`/ghost/getUserAds/${id}?take=${take}&skip=${skip*32}`, clean);
    return res.data;
  } catch (err) {
    console.error('getUserAds:', err);
    return null;
  }
}

export async function searchAds(filter: FilterDto|null, take: number,skip:number):Promise<Ads|null> {
  
  try {
    const clean  =cleanFilterDto(filter??{})
    const res = await axiosGhost.post(`/ghost/searchAds?take=${take}&skip=${skip* 32}`, clean );
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getAd(id: number):Promise<OneAdType|null> {
  try {
    const res = await axiosGhost.get(`/ghost/getAd/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
}