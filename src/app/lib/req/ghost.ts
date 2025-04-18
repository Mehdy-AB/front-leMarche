import { FilterDto } from "../validation/all.schema";
import axiosClient from "./axiosClient";

export async function getAllCategories() {
  try {
    const res = await axiosClient.get('/ghost/category');
    return res.data;
  } catch (err) {
    console.error('getAllCategories:', err);
    return null;
  }
}

export async function getCategoryById(id: number) {
  try {
    const res = await axiosClient.get(`/ghost/category/${id}`);
    return res.data;
  } catch (err) {
    console.error('getCategoryById:', err);
    return null;
  }
}

export async function getTypes(categoryId: number) {
  try {
    const res = await axiosClient.get(`/ghost/type?id=${categoryId}`);
    return res.data;
  } catch (err) {
    console.error('getTypes:', err);
    return null;
  }
}

export async function getType(typeId: number) {
  try {
    const res = await axiosClient.get(`/ghost/type/${typeId}`);
    return res.data;
  } catch (err) {
    console.error('getType:', err);
    return null;
  }
}

export async function getBrands(typeId: number) {
  try {
    const res = await axiosClient.get(`/ghost/brand?id=${typeId}`);
    return res.data;
  } catch (err) {
    console.error('getBrands:', err);
    return null;
  }
}

export async function getBrand(id: number) {
  try {
    const res = await axiosClient.get(`/ghost/brand/${id}`);
    return res.data;
  } catch (err) {
    console.error('getBrand:', err);
    return null;
  }
}

export async function getAttributes(typeId: number) {
  try {
    const res = await axiosClient.get(`/ghost/attribute?id=${typeId}`);
    return res.data;
  } catch (err) {
    console.error('getAttributes:', err);
    return null;
  }
}

export async function getRegions() {
  try {
    const res = await axiosClient.get('/ghost/location/region');
    return res.data;
  } catch (err) {
    console.error('getRegions:', err);
    return null;
  }
}

export async function getDepartments(regionId: number) {
  try {
    const res = await axiosClient.get(`/ghost/location/department?id=${regionId}`);
    return res.data;
  } catch (err) {
    console.error('getDepartments:', err);
    return null;
  }
}

export async function getCities(departmentId: number) {
  try {
    const res = await axiosClient.get(`/ghost/location/city?id=${departmentId}`);
    return res.data;
  } catch (err) {
    console.error('getCities:', err);
    return null;
  }
}

export async function getUser(id: number) {
  try {
    const res = await axiosClient.get(`/ghost/user/${id}`);
    return res.data;
  } catch (err) {
    console.error('getUser:', err);
    return null;
  }
}

export async function getUserFollowers(id: number, take: number, skip: number) {
  try {
    const res = await axiosClient.get(`/ghost/user/followers?id=${id}&take=${take}&skip=${skip}`);
    return res.data;
  } catch (err) {
    console.error('getUserFollowers:', err);
    return null;
  }
}

export async function getUserFollowing(id: number, take: number, skip: number) {
  try {
    const res = await axiosClient.get(`/ghost/user/following?id=${id}&take=${take}&skip=${skip}`);
    return res.data;
  } catch (err) {
    console.error('getUserFollowing:', err);
    return null;
  }
}

export async function getUserAds(id: number, filter: FilterDto, take: number, skip: number) {
  try {
    const res = await axiosClient.post(`/ghost/user/ads?id=${id}&take=${take}&skip=${skip}`, { data: filter });
    return res.data;
  } catch (err) {
    console.error('getUserAds:', err);
    return null;
  }
}

export async function getAd(id: number) {
  try {
    const res = await axiosClient.get(`/ghost/ad?id=${id}`);
    return res.data;
  } catch (err) {
    console.error('getAd:', err);
    return null;
  }
}

export async function searchAds(filter: FilterDto, take: number, skip: number) {
  try {
    const res = await axiosClient.post(`/ghost/ad/search?take=${take}&skip=${skip}`, { data: filter });
    return res.data;
  } catch (err) {
    console.error('searchAds:', err);
    return null;
  }
}
