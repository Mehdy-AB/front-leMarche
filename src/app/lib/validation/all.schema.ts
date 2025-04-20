import { getToken } from "next-auth/jwt";
import { z } from "zod";

// brand
export const brandSchema = z.object({
  id: z.number().min(0),
  modeles: z.array(z.number()).optional(),
});

// type
export const typeSchema = z.object({
  id: z.number().min(0),
  brand: z.array(brandSchema).optional(),
});

// category
export const categorySchema = z.object({
  id: z.number().min(0),
  type: z.array(typeSchema).optional(),
});

// locations
export const locationSchema = z.object({
  id: z.number().min(0),
  type: z.enum(["region", "city", "department"]),
});

// AdAttributeDto
export const adAttributeSchema = z.object({
  attributeId: z.number(),
  value: z.union([
    z.array(z.number()),
    z.object({
      min: z.number(),
      max: z.number(),
    }),
  ]),
});

// Main filterDto
export const filterDtoSchema = z.object({
  search: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().max(10000000).optional(),
  locationIds: z.array(locationSchema).optional(),
  category: z.array(categorySchema),
  attributes: z.array(adAttributeSchema).optional(),
  tri: z.enum(["plus recent", "plus cher", "moins cher", "plus ancien"]),
});

export type FilterDto = z.infer<typeof filterDtoSchema>;
//?----------------------------------------------------

// Company DTO
export const companyDtoSchema = z.object({
  name: z.string().min(4).max(30),
  siret: z.string().length(14).regex(/^\d+$/),
  address: z.string().max(100).optional(),
});

// User DTO
export const userDtoSchema = z.object({
  company: companyDtoSchema.optional(),
  fullName: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  userType: z.enum(["INDIVIDUAL", "PROFESSIONAL"]),
  phone: z.string().min(10).max(15).regex(/^\d+$/),
  token: z.string().jwt(),
  password: z.string().min(8).max(30),
  passwordConfirmation: z.string().min(8).max(30),
}).refine((data)=>data.password===data.passwordConfirmation,{
  message:'password not match',
  path:['passwordConfirmation']
});

// SendCode DTO
export const sendCodeDtoSchema = z.object({
  email: z.string().email('Vérifiez l’adresse email, son format n’est pas valide.').min(5,'Vérifiez l’adresse email, son format n’est pas valide.').max(100,'Vérifiez l’adresse email, son format n’est pas valide.'),
});
export const otpSchema = z.object({
    otp: z
    .array(z.string().regex(/^\d$/, 'Must be a digit'))
    .length(6, 'Code must have 6 digits'),
    email: z.string().email().min(5).max(100),
})

export type OtpSchema = z.infer<typeof otpSchema>

// Patterns
export const emailSchema = z.string().email()
export const phoneSchema = z
  .string()
  .regex(/^[0-9]{10,15}$/, 'Invalid phone number')
export const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z_]+[a-zA-Z0-9_]$/, 'Only letters, numbers, underscores allowed')

// Union of the three possibilities
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Input required')
    .refine(
      (val) =>
        emailSchema.safeParse(val).success ||
        phoneSchema.safeParse(val).success ||
        usernameSchema.safeParse(val).success,
      {
        message: 'Must be a valid email, username, or phone number',
      }
    ),
  password: z
    .string()
    .min(8, 'Password is required')
    .refine(
      (val) =>
        /[A-Z]/.test(val) && // At least one uppercase letter
        /[a-z]/.test(val) && // At least one lowercase letter
        /\d/.test(val) && // At least one number
        /[!@#$%^&*(),.?":{}|<>]/.test(val), // At least one special character
      {
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      }
    ),
});

export type LoginDto = z.infer<typeof loginSchema>

export type UserDto = z.infer<typeof userDtoSchema>;
export type CompanyDto = z.infer<typeof companyDtoSchema>;
export type SendCodeDto = z.infer<typeof sendCodeDtoSchema>;

export const createAdAttributeSchema = z.object({
    attributeId: z.number().min(0),
    attributeCollectionId: z.number().min(0),
    value: z.any(),
  });
  
  export const createAdsSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    price: z.number().int().min(0),
    status: z.enum(['ACTIVE', 'SOLD', 'HIDDEN']),
    images: z.array(z.string()),
    videoid: z.number().optional(),
    attributes: z.array(createAdAttributeSchema).optional(),
    categoryId: z.number().min(0),
    typeId: z.number().min(0),
    brandId: z.number().min(0),
    modelId: z.number().min(0),
    locationId: z.number().min(0),
  });
  
  export const messageSchema = z.object({
    id: z.number().min(0),
    content: z.string().min(1),
  });
  
  export type MessageFormValues = z.infer<typeof messageSchema>;
  // UpdateAdsDto is PartialType(CreateAdsDto)
  export const updateAdsSchema = createAdsSchema.partial();
  
  export type CreateAdsFormValues = z.infer<typeof createAdsSchema>;
  export type UpdateAdsFormValues = z.infer<typeof updateAdsSchema>;