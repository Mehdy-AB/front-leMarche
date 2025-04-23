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

export type type ={
            id: number,
            name: string,
            categoryId: number
            brands: {
                id: number,
                name: string,
                typeId: number
            }[]
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