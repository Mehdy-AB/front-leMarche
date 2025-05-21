import axiosClient from './axiosClient';
import { CreateAdsFormValues, FilterDto, UpdateAdsFormValues } from '../validation/all.schema';
import { MesAds, UserAdType } from '../types/types';
import { cleanFilterDto } from '../functions';


export async function createAd(data: CreateAdsFormValues) {
  try {
    const formData = new FormData();

    // Append all non-file data as a JSON string under 'dto' field
    const { images, video, ...restData } = data;
    formData.append('dto', JSON.stringify(restData));

    // Append images if they exist
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // Append video if it exists
    if (video) {
      formData.append('video', video);
    }

    const res = await axiosClient.post('/user/createAd', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (err) {
    console.error('createAd error:', err);
    return null;
  }
}

export async function updateAd(adId: number, data: UpdateAdsFormValues) {
  try {
    const res = await axiosClient.put(`/user/ad?id=${adId}`, data );
    return res.data;
  } catch (err) {
    console.error('updateAd:', err);
    return null;
  }
}

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
    const clean  =cleanFilterDto(filter??{})
    const res = await axiosClient.post(`/user/myAds?take=${take}&skip=${skip*32}`,  clean );
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getMyAdById(adId: number):Promise<UserAdType|null> {
  try {
    const res = await axiosClient.get(`/user/myAd/${adId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function favoriteAd(adId: number) {
  try {
    const res = await axiosClient.post(`/user/favorite/${adId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function unfavoriteAd(adId: number) {
  try {
    const res = await axiosClient.delete(`/user/unfavorite/${adId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getFavorites(take: number, skip: number) {
  try {
    const res = await axiosClient.get(`/user/favorites?take=${take}&skip=${skip*32}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function followUser(userId: number) {
  try {
    const res = await axiosClient.post(`/user/follow/${userId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function unfollowUser(userId: number) {
  try {
    const res = await axiosClient.delete(`/user/unfollow/${userId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function sendMessage(data: {reciverId:number,content:string,adId:number|null}) {
  try {
    const res = await axiosClient.post('/user/send-message', data );
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
