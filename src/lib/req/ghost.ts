import { Attribute, brands, categories, category, cities, department, modeles, region, types } from "../types/types";
import { FilterDto } from "../validation/all.schema";
import axiosGhost from "./axiosGhost";

export async function getAllCategories(): Promise<categories|null> {
  try {
    const res = await axiosGhost.get('/ghost/category');
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getCategoryByname(name: string): Promise<category|null> {
  try {
    const res = await axiosGhost.get(`/ghost/category/${name}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getTypesByname(categoryname: string): Promise<types|null> {
  try {
    const res = await axiosGhost.get(`/ghost/category/one?name=${categoryname}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getTypesByid(categoryid: number): Promise<types|null> {
  try {
    const res = await axiosGhost.get(`/ghost/category/one?id=${categoryid}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getBrandsByid(typeid: number):Promise<brands|null> {
  try {
    const res = await axiosGhost.get(`/ghost/type?id=${typeid}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getBrandsByname(typename: string):Promise<brands|null> { 
  try {
    const res = await axiosGhost.get(`/ghost/type?name=${typename}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getModelesByid(typeid: number):Promise<modeles|null> {
  try {
    const res = await axiosGhost.get(`/ghost/brand?id=${typeid}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getModelesByname(typename: string):Promise<modeles|null> { 
  try {
    const res = await axiosGhost.get(`/ghost/brand?name=${typename}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getAttributes(typeId: number): Promise<Attribute|null> {
  try {
    const res = await axiosGhost.get(`/ghost/attribute?id=${typeId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getRegions():Promise<region|null> {
  try {
    const res = await axiosGhost.get('/ghost/location/region');
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function searchLocation(name: string):Promise<{departments:department,regions:region,cities:cities}|null>  {
  try {
    const res = await axiosGhost.get(`/ghost/location?name=${name}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getDepartments(regionId: number):Promise<department|null>  {
  try {
    const res = await axiosGhost.get(`/ghost/location/department?id=${regionId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getCities(departmentId: number):Promise<cities|null>  {
  try {
    const res = await axiosGhost.get(`/ghost/location/city?id=${departmentId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getUser(id: number) {
  try {
    const res = await axiosGhost.get(`/ghost/user/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getUserFollowers(id: number, take: number, skip: number) {
  try {
    const res = await axiosGhost.get(`/ghost/user/followers?id=${id}&take=${take}&skip=${skip}`);
    return res.data;
  } catch (err) {
    console.error('getUserFollowers:', err);
    return null;
  }
}

export async function getUserFollowing(id: number, take: number, skip: number) {
  try {
    const res = await axiosGhost.get(`/ghost/user/following?id=${id}&take=${take}&skip=${skip}`);
    return res.data;
  } catch (err) {
    console.error('getUserFollowing:', err);
    return null;
  }
}

export async function getUserAds(id: number, filter: FilterDto, take: number, skip: number) {
  try {
    const res = await axiosGhost.post(`/ghost/user/ads?id=${id}&take=${take}&skip=${skip}`, { data: filter });
    return res.data;
  } catch (err) {
    console.error('getUserAds:', err);
    return null;
  }
}

export async function getAd(id: number) {
  try {
    const res = await axiosGhost.get(`/ghost/ad?id=${id}`);
    return res.data;
  } catch (err) {
    console.error('getAd:', err);
    return null;
  }
}

export async function searchAds(filter: FilterDto, take: number, skip: number) {
  try {
    const res = await axiosGhost.post(`/ghost/ad/search?take=${take}&skip=${skip}`, { data: filter });
    return res.data;
  } catch (err) {
    console.error('searchAds:', err);
    return null;
  }
}
