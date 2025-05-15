'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Filter from '@/components/search/ads/Filter';
import { FilterDto } from '@/lib/validation/all.schema';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { useSession } from 'next-auth/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { HiOutlineMail, HiPhone } from 'react-icons/hi';
import { FiUserCheck, FiMessageSquare } from 'react-icons/fi';
import { Ads, User } from '@/lib/types/types';
import { getUser, getUserAds, searchAds } from '@/lib/req/ghost';
import { UserAvatar } from '@/components/all/UserAvatar';
import { followUser, unfollowUser } from '@/lib/req/user';
import { filterFromQueryParams, filterToQueryParams } from '@/lib/functions';
import { OneAd } from '@/components/all/OneAd';

export default function UserProfilePage() {
   const session = useSession();
    const router = useRouter();
    const [isLoading,setIsLoading]=useState(true);
    const params = useParams();
    const id = params?.id;
    const [user,setUser]=useState<User|null>(null)
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    const initialPage = Number(searchParams.get('page')) || 0
    
    const [page, setPage] = useState(initialPage)
    const [ads, setAds] = useState<Ads>([]);

    useEffect(()=>{
      if(!id||!Number(id)){
        router.back();
        return;
      }
      const fetchAd=async()=>{
        const data = await getUser(+id)
        setUser(data)
        setIsLoading(false)
      }
      fetchAd();
      const parsedFilter = filterFromQueryParams(searchParams); 
      if(!id||!Number(id)){
        router.back();
        return;
      }
      getUserAds(+id,parsedFilter??{}, 33,page*32).then((ads) => {
        setAds(ads || []);
        setLoading(false);
      });
    },[]) 
  
    const recharche = (data: FilterDto) => {
      if(!id||!Number(id)){
        router.back();
        return;
      }
      const query = filterToQueryParams(data);
      router.push(`/user/${id}?${query}`);
      setPage(0);
      getUserAds(+id,data, 33,0).then((ads) => {
        setAds(ads || []);
        setLoading(false);
      });
    };

    useEffect(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      params.set('page', String(page))
      router.replace(`?${params.toString()}`)
    }, [page])

  const follow=()=>{
        if(!session||session.status!=='authenticated'||!user)return;
    
        if(!!user.followers.find(f=>f.followerId===session.data.user.id)){
          setUser((prv) => {
            if (!prv) return null;
            return {
              ...prv,
              _count: {
                ...prv._count,
                followers: prv._count.followers - 1,
              },
              followers: prv.followers?.filter(f => f.followerId !== session.data?.user.id),
            };
          });
          unfollowUser(user.id)
        }
        else{
          setUser((prv) => {
            if (!prv) return null;
            return {
              ...prv,
              _count: {
                ...prv._count,
                followers: prv._count.followers + 1,
              },
              followers: [...prv.followers,{followerId:session.data.user.id}],
            };
          });
          followUser(user.id)
        }
      }

  return (<>
  <Header session={session.data}/>
    <main className="font-poppins min-h-screen bg-gray-50">
    {isLoading?
    <><section className="bg-white border-b py-8 px-4">
          <div className="max-w-6xl items-center mx-auto flex flex-col md:flex-row gap-6 lg:items-start">
            {/* LEFT: Profile Image & Username + Stats Skeleton */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse mb-2" />
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1" />
              <div className="h-3 w-32 bg-gray-100 animate-pulse rounded" />
            </div>

            {/* CENTER: Info Skeleton */}
            <div className="flex-1 space-y-3">
              <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
              <div className="h-6 w-40 bg-yellow-100 animate-pulse rounded" />
              <div className="space-y-2 mt-2">
                <div className="h-4 w-56 bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-40 bg-gray-100 animate-pulse rounded" />
              </div>
              <div className="h-20 w-full bg-gray-100 animate-pulse rounded mt-4" />
            </div>

            {/* RIGHT: Action Buttons Skeleton */}
            <div className="flex flex-col gap-3 lg:items-end w-full md:w-auto">
              <div className="h-10 w-48 bg-gray-200 animate-pulse rounded" />
              <div className="h-10 w-48 bg-gray-100 animate-pulse rounded border" />
            </div>
          </div>
        </section><section className="max-w-7xl mx-auto py-8 px-4">
            <div className="h-6 w-64 bg-gray-200 animate-pulse mb-6 rounded" />

            {/* Filter Skeleton */}
            <div className="h-12 bg-gray-100 animate-pulse rounded mb-6" />

            {/* Ads Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
                  <div className="w-full h-40 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-2/3 bg-gray-100 animate-pulse rounded" />
                    <div className="h-5 w-1/3 bg-gray-300 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section></>
    :<><section className="bg-white border-b py-8 px-4">
          <div className="max-w-6xl items-center mx-auto flex flex-col md:flex-row gap-6 lg:items-start">
            {/* LEFT: Profile Image & Username + Stats */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-colorOne mb-2">
                {user?.image?.url ? (
                  <Image
                    height={112}
                    width={112}
                    src={user.image.url}
                    alt="User"
                    className="rounded-full cursor-pointer mx-auto object-cover" />
                ) : (
                  <UserAvatar height={112} userName={user?.username || 'A'} />

                )}
              </div>
              <p className="text-gray-800 font-medium">@{user?.username}</p>
              <div className="text-xs text-gray-500 mt-1">
                <span>{user?._count.followers} abonnés</span> ·{' '}
                <span>{user?._count.following} abonnements</span>
              </div>
            </div>

            {/* CENTER: Info */}
            <div className="flex-1 space-y-2">
              <h1 className="text-xl font-semibold text-gray-900">{user?.fullName}</h1>
              {user?.userType === 'COMPANY' && (
                <p className="inline-block text-sm text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                  Compte professionnel
                </p>
              )}

              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <HiOutlineMail color='#6b7280' />
                  <a href={`mailto:${user?.email}`} className="hover:underline">{user?.email}</a>
                </p>
                <p className="flex items-center gap-2">
                  <HiPhone color='#6b7280' />
                  <a href={`tel:${user?.phone}`} className="hover:underline">{user?.phone}</a>
                </p>
              </div>

              <p className="mt-4 text-sm text-gray-700 leading-relaxed">{user?.bio}</p>
            </div>

            {/* RIGHT: Actions */}
            {!(user?.id === session.data?.user.id) && <div className="flex flex-col gap-3 lg:items-end w-full md:w-auto">
              <button className="bg-colorOne text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                <FiMessageSquare /> Envoyer un message
              </button>

              <button onClick={() => follow()} className="bg-white border border-colorOne text-colorOne px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-50">
                <FiUserCheck /> {user?.followers.find(f => f.followerId === session.data?.user.id) ? 'Abonné' : 'Suivre'}
              </button>
            </div>}
          </div>
        </section><section className="max-w-7xl mx-auto py-8 px-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Annonces de {user?.username}</h2>

            {/* Optional Filter Bar */}
            <Filter handleSubmitData={recharche}/>


            {/* Ads Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white"
                  >
                    <div className="w-full h-40 bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
                      <div className="h-4 w-2/3 bg-gray-100 animate-pulse rounded" />
                      <div className="h-5 w-1/3 bg-gray-300 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : ads.length === 0 ? (
              <div className="max-w-5xl mx-auto mt-16 mb-24 flex flex-col items-center text-center px-6">
                <div className="flex items-center gap-4">
                  <Image
                    alt="no-result"
                    width={400}
                    height={400}
                    src="/images/no-result.png"
                    className="h-full"
                  />
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Oups ! Aucune annonce trouvée
                    </h2>
                    <p className="text-gray-600 mt-2 max-w-md">
                      Cet utilisateur n’a publié aucune annonce pour le moment.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {ads.slice(0, 32).map((ad, idx) => (
                  <OneAd key={idx} ad={ad} setAds={setAds} />
                ))}
              </div>
            )}
            {!loading && (
              <nav className="flex items-center justify-center gap-2 mt-8">
                
                  <button
                  disabled={page ===0 }
                    onClick={() => setPage(p => Math.max(p - 1, 0))}
                    className="px-4 py-2 text-sm disabled:opacity-50 disabled:pointer-events-none rounded-lg border bg-white text-gray-800 hover:bg-gray-100"
                  >
                    Précédent
                  </button>
              
                {[0, 1, 2].map((offset) => {
                  const p = page === 0 ? page + offset : page - 1 + offset;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      disabled={(page!==p&&ads.length < 33)}
                      className={`px-3 py-2 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none border ${p === page ? 'bg-colorOne text-white' : 'text-gray-800 hover:bg-gray-100'}`}
                    >
                      {p + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={ads.length < 33}
                  className="px-4 py-2 text-sm rounded-lg border bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Suivant
                </button>
              </nav>
            )}
          </section></>}
    </main>
    <Footer/>
    </>);
}
