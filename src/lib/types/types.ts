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

export type modeles ={
            brandsId: number,
            id: number,
            name: string,
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
        type: 'TEXT'|'NUMBER'|'SELECT';
        unit: string | null;
        collectionId: number;
    })[];
}
export type filterAttrbuites = {id:number|string,value:any}[]
