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

// locations
export const locationSchema = z.object({
  id: z.number().min(0),
  type: z.enum(["region", "city", "department"]),
  name:z.string()
});

// AdAttributeDto
export const adAttributeSchema = z.object({
  attributeId: z.number(),
  value: z.union([
    z.array(z.number()).optional(),
    z.object({
      min: z
    .preprocess((val) => (isNaN(val as number) ? undefined : val), z.number().nullable().optional()),
  max: z
    .preprocess((val) => (isNaN(val as number) ? undefined : val), z.number().nullable().optional()),
    }),
  ])  
});

// Main filterDto
export const filterDtoSchema = z.object({
  search: z.string().optional(),
  minPrice: z.preprocess((val) => (isNaN(val as number) ? undefined : val), z.number().nullable().optional()),
  maxPrice:  z.preprocess((val) => (isNaN(val as number) ? undefined : val), z.number().nullable().optional()),
  locationIds: z.array(locationSchema).optional(),
  type: typeSchema.optional(),
  attributes: z.array(adAttributeSchema).optional(),
  tri: z.enum(["plus recent", "plus cher", "moins cher", "plus ancien"]).optional(),
  page:z.number().min(0).default(0).optional()
});

export const filterEtape2Schema = z.object({
  locationIds: z.array(locationSchema).optional(),
  brand:z.array(brandSchema).optional(),
});
export type filterEtape2Dto = z.infer<typeof filterEtape2Schema>;
export type FilterDto = z.infer<typeof filterDtoSchema>;
//?----------------------------------------------------
export const siretSchema = z.object({
  siret: z
    .string()
    .min(14, "Le numéro SIRET doit contenir 14 chiffres")
    .max(14)
    .regex(/^\d+$/, "Le numéro SIRET doit contenir uniquement des chiffres"),
});

export type SiretFormData = z.infer<typeof siretSchema>;
// Company DTO
export const companyDtoSchema = z.object({
  siret: z
    .string()
    .min(14, "Le numéro SIRET doit contenir 14 chiffres")
    .max(14)
    .regex(/^\d+$/, "Le numéro SIRET doit contenir uniquement des chiffres"),
  kbis: z.any()
    .refine((files) => files?.length > 0, "KBIS file is required")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, "Max file size is 10MB")
    .refine(
      (files) => ['application/pdf', 'image/jpeg', 'image/png'].includes(files?.[0]?.type),
      "Only PDF, JPEG, or PNG files are allowed"
    ),
  
  id: z.any()
    .refine((files) => files?.length > 0, "ID file is required")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, "Max file size is 10MB")
    .refine(
      (files) => ['application/pdf', 'image/jpeg', 'image/png'].includes(files?.[0]?.type),
      "Only PDF, JPEG, or PNG files are allowed"
    ),
  
  address: z.any()
    .refine((files) => files?.length > 0, "Address proof is required")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, "Max file size is 10MB")
    .refine(
      (files) => ['application/pdf', 'image/jpeg', 'image/png'].includes(files?.[0]?.type),
      "Only PDF, JPEG, or PNG files are allowed"
    )
});

// User DTO
export const nameSchema = z
  .string({message:'field must be string'})
  .min(3,{message:'field at least 3 char'})
  .max(20,{message:'field at max 20 char'})
  .regex(/^[a-zA-Z_]+[a-zA-Z0-9_]$/, 'Only letters, numbers, underscores allowed')

export const usernameSchemaObject = z.object({
  username:nameSchema
})
  
export const userDtoSchema = z.object({
  company: companyDtoSchema.optional(),
  firstName: nameSchema,
  lastName: nameSchema,
  userType: z.enum(["INDIVIDUAL", "PROFESSIONAL"]),
  emailtoken: z.string().jwt(),
  phonetoken: z.string().jwt(),
  password: z.string().min(8).max(30).refine(
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
  passwordConfirmation: z.string().min(8).max(30),
}).refine((data)=>data.password===data.passwordConfirmation,{
  message:'password not match',
  path:['passwordConfirmation']
});

// SendCode DTO
export const sendCodeDtoSchema = z.object({
  email: z.string().email('Vérifiez l’adresse email, son format n’est pas valide.').min(5,'Vérifiez l’adresse email, son format n’est pas valide.').max(100,'Vérifiez l’adresse email, son format n’est pas valide.'),
});
export const sendCodeDtoPhoneSchema = z.object({
  phone: z
    .string()
    .length(12, { message: 'Le numéro doit comporter 12 caractères (ex: +33612345678)' })
    .regex(/^\+33[67]\d{8}$/, { message: 'Le numéro doit commencer par +33 suivi de 9 chiffres valides pour la France (mobile)' }),
});

export type SendCodeDtoPhone = z.infer<typeof sendCodeDtoPhoneSchema>;

export const otpSchemaPhone = z.object({
  otp: z
    .array(z.string().regex(/^\d$/, 'Doit être un chiffre'))
    .length(6, 'Le code doit comporter 6 chiffres'),
  phone: z
    .string()
    .length(12, { message: 'Le numéro doit comporter 12 caractères (ex: +33612345678)' })
    .regex(/^\+33[67]\d{8}$/, { message: 'Le numéro doit commencer par +33 suivi de 9 chiffres valides pour la France (mobile)' }),
});

export type OtpSchemaPhone = z.infer<typeof otpSchemaPhone>

export const otpSchema = z.object({
    otp: z
    .array(z.string().regex(/^\d$/, 'Must be a digit'))
    .length(6, 'Code must have 6 digits'),
    email: z.string().email().min(5).max(100),
})

export type OtpSchema = z.infer<typeof otpSchema>

export const uploadSchema = z.object({
  kbis: z.any()
    .refine((files) => files?.length > 0, "KBIS file is required")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, "Max file size is 10MB")
    .refine(
      (files) => ['application/pdf', 'image/jpeg', 'image/png'].includes(files?.[0]?.type),
      "Only PDF, JPEG, or PNG files are allowed"
    ),
  
  id: z.any()
    .refine((files) => files?.length > 0, "ID file is required")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, "Max file size is 10MB")
    .refine(
      (files) => ['application/pdf', 'image/jpeg', 'image/png'].includes(files?.[0]?.type),
      "Only PDF, JPEG, or PNG files are allowed"
    ),
  
  address: z.any()
    .refine((files) => files?.length > 0, "Address proof is required")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, "Max file size is 10MB")
    .refine(
      (files) => ['application/pdf', 'image/jpeg', 'image/png'].includes(files?.[0]?.type),
      "Only PDF, JPEG, or PNG files are allowed"
    )
});

export type UploadData = z.infer<typeof uploadSchema>;

// Patterns
export const emailSchema = z.string().email()
export const phoneSchema = z
  .string()
  .regex(/^[0-9]{10,15}$/, 'Invalid phone number')


// Union of the three possibilities
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Input required')
    .refine(
      (val) =>
        emailSchema.safeParse(val).success ||
        phoneSchema.safeParse(val).success ||
        nameSchema.safeParse(val).success,
      {
        message: 'Must be a valid email, username, or phone number',
      }
    ),
  password: z
    .string()
    .min(8, 'Password is required')
});

export type LoginDto = z.infer<typeof loginSchema>

export type UserDto = z.infer<typeof userDtoSchema>;
export type CompanyDto = z.infer<typeof companyDtoSchema>;
export type SendCodeDto = z.infer<typeof sendCodeDtoSchema>;

//!--------------------------------------------------------------------------------------


export const createAdsSchema = z.object({
  title: z
    .string()
    .min(6, { message: 'Le titre doit contenir au moins 6 caractères.' }),
    
  description: z
    .string()
    .min(20, { message: 'La description doit contenir au moins 20 caractères.' }),

  price: z
    .number({ invalid_type_error: 'Le prix doit être un nombre.' })
    .int({ message: 'Le prix doit être un entier.' })
    .min(100, { message: 'Le prix doit être au moins de 100 Euro.' })
    .max(10000000000, { message: 'Le prix ne doit pas dépasser 1 000 000 000 Euro.' }),

  status: z.enum(['Active', 'Brouillon'], {
    errorMap: () => ({ message: 'Le statut sélectionné est invalide.' }),
  }),

  // Updated images validation (now accepts FileList)
  images: z.any()
    .refine((files) => files?.length >= 3, {
      message: 'Vous devez ajouter au moins 3 images.'
    })
    .refine((files) => files?.length <= 10, {
      message: 'Vous ne pouvez pas ajouter plus de 10 images.'
    })
    .refine((files) => {
      return Array.from(files as FileList).every(file => 
        file.type.startsWith('image/')
      );
    }, {
      message: 'Seules les images sont acceptées (JPEG, PNG, etc.)'
    }),

  // New optional video field
  video:  z.instanceof(File)
  .optional()
  .refine((file) => {
    if (!file) return true; // Optional
    return file.type.startsWith('video/');
  }, {
    message: 'Seules les vidéos sont acceptées (MP4, MOV, etc.)'
  })
  .refine((file) => {
    if (!file) return true;
    return file.size <= 100 * 1024 * 1024; // 100MB max
  }, {
    message: 'La vidéo ne doit pas dépasser 100MB'
  }),

    categoryId: z
      .number({ invalid_type_error: 'La catégorie est requise.' })
      .min(0, { message: 'Veuillez sélectionner une catégorie.' }),

    typeId: z
      .number({ invalid_type_error: 'Le type est requis.' })
      .min(0, { message: 'Veuillez sélectionner un type.' }),

    brandId: z
      .number({ invalid_type_error: 'La marque est requise.' })
      .min(0, { message: 'Veuillez sélectionner une marque.' }).optional(),

    modelId: z
      .number({ invalid_type_error: 'Le modèle est requis.' })
      .min(0, { message: 'Veuillez sélectionner un modèle.' }).optional(),

    locationId: z
      .number({ invalid_type_error: 'La localisation est requise.' })
      .min(0, { message: 'Veuillez sélectionner une localisation.' }),

    attributes: z
      .array(
        z.object({
          attributeId: z.number(),
          name: z.string(),
          attributeCollectionId: z.number(),
          value: z.number().optional(),
          required: z.boolean().optional(),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.attributes) return;

    data.attributes.forEach((attr, index) => {
      if (attr.required) {
        const isEmpty =
          attr.value === undefined ||
          attr.value === null;
        if (isEmpty) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `« ${attr.name} » est requis`,
            path: ['attributes', index, 'value'],
          });
        }
      }
    });
  });

  export const updateAdsSchema = z
  .object({
    title: z
      .string()
      .min(6, { message: 'Le titre doit contenir au moins 6 caractères.' }),
      
    description: z
      .string()
      .min(20, { message: 'La description doit contenir au moins 20 caractères.' }),

    price: z
      .number({ invalid_type_error: 'Le prix doit être un nombre.' })
      .int({ message: 'Le prix doit être un entier.' })
      .min(100, { message: 'Le prix doit être au moins de 100 Euro.' })
      .max(10000000000, { message: 'Le prix ne doit pas dépasser 1 000 000 000 Euro.' }),

    status: z.enum(['Active', 'Brouillon'], {
      errorMap: () => ({ message: 'Le statut sélectionné est invalide.' }),
    }),

    images: z
      .array(
        z.object({
          id:z.number(),
          file:z.string(),
          type:z.enum(['new','old'])
        })
      )
      .min(3, { message: 'Vous devez ajouter au moins 3 images.' })
      .max(10, { message: 'Vous ne pouvez pas ajouter plus de 10 images.' }),

    videoid: z.number().optional(),

    categoryId: z
      .number({ invalid_type_error: 'La catégorie est requise.' })
      .min(0, { message: 'Veuillez sélectionner une catégorie.' }),

    typeId: z
      .number({ invalid_type_error: 'Le type est requis.' })
      .min(0, { message: 'Veuillez sélectionner un type.' }),

    brandId: z
      .number({ invalid_type_error: 'La marque est requise.' })
      .min(0, { message: 'Veuillez sélectionner une marque.' }).optional(),

    modelId: z
      .number({ invalid_type_error: 'Le modèle est requis.' })
      .min(0, { message: 'Veuillez sélectionner un modèle.' }).optional(),

    locationId: z
      .number({ invalid_type_error: 'La localisation est requise.' })
      .min(0, { message: 'Veuillez sélectionner une localisation.' }),

    attributes: z
      .array(
        z.object({
          attributeId: z.number(),
          name: z.string(),
          attributeCollectionId: z.number(),
          value:  z.number().optional(),
          required: z.boolean().optional(),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.attributes) return;

    data.attributes.forEach((attr, index) => {
      if (attr.required) {
        const isEmpty =
          attr.value === undefined ||
          attr.value === null 
        if (isEmpty) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `« ${attr.name} »`,
            path: ['attributes', index, 'value'],
          });
        }
      }
    });
  });
  
  export type CreateAdsFormValues = z.infer<typeof createAdsSchema>;
  export type UpdateAdsFormValues = z.infer<typeof updateAdsSchema>;