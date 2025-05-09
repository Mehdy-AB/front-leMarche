import axiosClient from './axiosClient';
import { CreateAdsFormValues, FilterDto, MessageFormValues } from '../validation/all.schema';
import { MesAds } from '../types/types';
export async function createAd(data: CreateAdsFormValues) {
  try {
    const res = await axiosClient.post('/user/ad', { data });
    return res.data;
  } catch (err) {
    console.error('createAd:', err);
    return null;
  }
}

// export async function updateAd(adId: number, data: UpdateAdsFormValues) {
//   try {
//     const res = await axiosClient.put(`/user/ad?id=${adId}`, { data });
//     return res.data;
//   } catch (err) {
//     console.error('updateAd:', err);
//     return null;
//   }
// }

export async function deleteAd(adId: number) {
  try {
    const res = await axiosClient.delete(`/user/ad?id=${adId}`);
    return res.data;
  } catch (err) {
    console.error('deleteAd:', err);
    return null;
  }
}

export async function getMyAds(filter: FilterDto, take: number, skip: number):Promise<MesAds|[]> {
  try {
    const res = await axiosClient.post(`/user/ad/my?take=${take}&skip=${skip}`,  filter );
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getMyAdById(adId: number, take: number, skip: number) {
  try {
    const res = await axiosClient.get(`/user/ad/single?id=${adId}&take=${take}&skip=${skip}`);
    return res.data;
  } catch (err) {
    console.error('getMyAdById:', err);
    return null;
  }
}

export async function favoriteAd(adId: number) {
  try {
    const res = await axiosClient.post(`/user/favorites?id=${adId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function unfavoriteAd(adId: number) {
  try {
    const res = await axiosClient.delete(`/user/favorites?id=${adId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getFavorites(take: number, skip: number) {
  try {
    const res = await axiosClient.get(`/user/favorites/list?take=${take}&skip=${skip}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function followUser(userId: number) {
  try {
    const res = await axiosClient.post(`/user/follow?id=${userId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function unfollowUser(userId: number) {
  try {
    const res = await axiosClient.delete(`/user/follow?id=${userId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function sendMessage(data: MessageFormValues) {
  try {
    const res = await axiosClient.post('/user/message', { data });
    return res.data;
  } catch (err) {
    console.error('sendMessage:', err);
    return null;
  }
}

export async function getUnreadCount() {
  try {
    const res = await axiosClient.get('/user/message/unread');
    return res.data;
  } catch (err) {
    console.error('getUnreadCount:', err);
    return null;
  }
}

export async function getConversations(take: number, skip: number) {
  try {
    const res = await axiosClient.get(`/user/message/conversations?take=${take}&skip=${skip}`);
    return res.data;
  } catch (err) {
    console.error('getConversations:', err);
    return null;
  }
}

export async function getThread(otherUserId: number, take: number, skip: number) {
  try {
    const res = await axiosClient.get(`/user/message/thread?otherUserId=${otherUserId}&take=${take}&skip=${skip}`);
    return res.data;
  } catch (err) {
    console.error('getThread:', err);
    return null;
  }
}
