export type category ={ 
    id: number; 
    name: string,
    url: string,
    types: {
            id: number,
            name: string,
            url: string,
            categoryId: number
        }[]}[]

export type categories ={ 
    id: number; 
    name: string,
    url: string,
}[]

export type types ={ 
    id: number; 
    name: string,
    url: string,
    categoryId: number
    }[]

export type brands ={
            id: number,
            name: string,
            typeId: number
        }[]

export type region ={
            id: number,
            name: string,
        }[]
export type department ={
            regionId: number,
            id: number,
            name: string,
        }[]
        

export type cities ={
            id: number,
            name: string,
            departmentId:number
        }[]

export type FilterCategory = {
  id: number;
  name: string;
  categoryTypeId: number;
  attributes: Attribute[];
};

export type Attribute= {
    title: string;
    data: ({
        options: {
            id: number;
            value: string;
            attributeId: number;
        }[];
    } & {
        id: number;
        name: string;
        multiple: boolean,
        required: boolean,
        min: number | null;
        max: number | null;
        step: number | null;
        type: 'TEXT'|'NUMBER'|'SELECT';
        unit: string | null;
        collectionId: number;
    })[];
}
export type filterAttrbuites = {id:number|string,value:any}[]
export type modeles ={
        id: number,
        name: string,
        models: {
                id: number,
                name: string
            }[]}[]

export type Ads={
    id:number,
    title: string;
    createdAt: string; // or Date if parsed
    price:number;
    media: {
      media: {
        url: string;
      };
    }[];
    favoritesBy:{id:number}[]
    attributes: {
      attribute: {
        id:number,
        name: string;
        unit: string | null;
        type: "SELECT" | "NUMBER" |'TEXT';
      };
      value: number | null; // assume string is possible
      option: {value: string}|null
    }[];
  
    brand: {
      name: string;
    };
  
    model: {
      name: string;
    };
  
    region: {
      name: string;
    };
  
    department: {
      name: string;
    };
  
    user: {
      id:number;
      username: string;
      userType: "INDIVIDUAL" | "PROFESSIONAL" | string;
      image: { url: string } | null;
    };
  }[];

  export type OneAdType= {
    id:number
    title: string;
    description: string;
    price: number;
    video: string | null;
    createdAt: string;
    favoritesBy:{id:number}[];
    _count: {
      favoritesBy: number;
    };
    media: {
      media: {
        url: string;
      };
    }[];
    attributes: {
      attribute: {
        name: string;
        id: number;
        unit: string | null;
        type: 'SELECT' | 'NUMBER' | string;
      };
      value: number | null;
      option: {
        value: string;
      } | null;
    }[];
    brand: {
      name: string;
    };
    model: {
      name: string;
    };
    region: {
      name: string;
    };
    department: {
      name: string;
    };
    user: {
      id: number;
      _count: {
            followers: number,
            following: number,
            ads: number
        };
      username: string;
      fullName: string;
      activeAt: string;
      phone: string;
      userType: 'INDIVIDUAL' | 'PROFESSIONAL' | string;
      image: { url: string } | null;
    };
  };
  
  export type User = {
    id: number;
    fullName: string;
    username: string;
    bio: string | null;
    email: string;
    phone: string;
    activeAt: string; // ISO date string
    image: {
      url: string;
    } | null;
    userType: "INDIVIDUAL" | "COMPANY";
    company: any | null; // Replace `any` with the correct type if you have it
    followers: {followerId:number}[]; // Replace `any` with actual follower type if needed
    _count: {
      followers: number;
      following: number;
    };
  };

  export type MesAds={
    id:number,
    title: string;
    createdAt: string; 
    updatedAt: string,
    views: number,
    status:"Active"|"Brouillon"
     _count: {
        favoritesBy: number
      },
    price:number;
    media: {
      media: {
        url: string;
      };
    }[];
    attributes: {
      attribute: {
        id:number,
        name: string;
        unit: string | null;
        type: "SELECT" | "NUMBER" |'TEXT';
      };
      value: number | null; // assume string is possible
      option: {value: string}|null
    }[];
  
  }[];