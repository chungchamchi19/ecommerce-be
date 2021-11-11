import { Pagination } from "./../../types/type.pagination";
import { Variant } from "./../../entities/variant";
import { convertToSlug } from "../../utils/convertToSlug";
import variantDaos from "./daos";
import configs from "../../configs";
import mediaServices from "../media/services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Media } from "../../entities/media";

// const createvariant = async (variant: Variant) => {
//   if (variant.featureImageId) {
//     checkvariantMedia(variant.media, variant.featureImageId);
//   }
//   for (let i = 0; i < variant.media.length; i++) {
//     const image = variant.media[i]?.id;
//     const checkMedia = await mediaServices.getMediaById(Number(image));
//     if (checkMedia && checkMedia.targetId) {
//       throw new CustomError(codes.BAD_REQUEST, "Media is belong to another variant!");
//     }
//   }
//   const variantData: variant = variant;
//   if (!variantData.url) {
//     const countvariantByUrl: number = await variantDaos.countvariants({ title: variantData.title });
//     if (countvariantByUrl) {
//       variantData.url = convertToSlug(variantData.title + " " + countvariantByUrl);
//     } else {
//       variantData.url = convertToSlug(variantData.title);
//     }
//   }
//   // cache lai media
//   const cacheMedia = variant.media;
//   delete variant.media;
//   // create new variant
//   const newvariant = await variantDaos.createvariant(variantData);
//   // update media for variant
//   const listMedia = [];
//   for (let i = 0; i < cacheMedia.length; i++) {
//     const image = cacheMedia[i]?.id;
//     const updatedMedia = await mediaServices.updateMedia(Number(image), {
//       targetId: newvariant.id,
//       targetType: "variant",
//     });
//     listMedia.push(updatedMedia);
//   }
//   const featureImage = listMedia.find((media: Media) => media.id === newvariant.featureImageId);
//   return {
//     ...newvariant,
//     media: listMedia,
//     featureImage,
//   };
// };

// const getvariants = async (params: { pagination: Pagination }): Promise<variant[]> => {
//   const pagination = {
//     limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
//     offset: params.pagination.offset || 0,
//   };
//   let listvariant = await variantDaos.getvariants({ pagination });
//   listvariant = listvariant.map((variant: variant) => {
//     return {
//       ...variant,
//       media: formatMedia(variant.featureImage, variant.media),
//     };
//   });
//   return listvariant;
// };

const getVariantById = async (id: number): Promise<Variant> => {
  const findvariant = await variantDaos.getVariantById(id);
  if (!findvariant) {
    throw new CustomError(codes.NOT_FOUND, "variant not found!");
  }
//   const media = formatMedia(findVariant.featureImage);
  return findvariant;
};

// const updatevariant = async (id: number, data: variant): Promise<variant> => {
//   const findvariant = await getvariantById(id);
//   delete data.id;
//   if (data.featureImageId && data.media) {
//     checkvariantMedia(data.media, data.featureImageId);
//   }
//   if (data.featureImageId) {
//     mediaServices.updateMedia(data.featureImageId, {
//       targetType: "variant",
//       targetId: findvariant.id,
//     });
//   }
//   if (data.media && !data.featureImageId && !data.media.find((item) => item.id === findvariant.featureImageId)) {
//     throw new CustomError(codes.BAD_REQUEST, "Feature image id should have in media list!");
//   }
//   if (data.media) {
//     const currentMedia = findvariant.media;
//     const deleteMedia = currentMedia.filter((media: Media) => {
//       return !data.media.find((item) => item.id === media.id);
//     });
//     const addMedia = data.media.filter((media: Media) => {
//       return !currentMedia.find((item) => item.id === media.id);
//     });
//     // delete media
//     for (let i = 0; i < deleteMedia.length; i++) {
//       const deteteItem = deleteMedia[i];
//       mediaServices.updateMedia(
//         deteteItem.id,
//         { targetId: null, targetType: null },
//         { targetId: findvariant.id, targetType: "variant" },
//       );
//     }
//     // update media
//     for (let i = 0; i < addMedia.length; i++) {
//       const addItem = addMedia[i];
//       mediaServices.updateMedia(addItem.id, { targetId: id, targetType: "variant" });
//     }
//     delete data.media;
//   }
//   await variantDaos.updatevariant(id, data);
//   return await getvariantById(id);
// };

// const deletevariant = async (id: number) => {
//   const findvariant = await getvariantById(id);
//   variantDaos.deletevariant(id);
//   return findvariant;
// };

// const formatMedia = (featureImage: Media) => {
//   if (featureImage) {
//     return [featureImage, ...media.filter((item: Media) => item?.id !== featureImage?.id)];
//   }
//   return media;
// };

// const checkvariantMedia = (media: Media[], featureImageId: number) => {
//   if (!media.find((item) => item.id === featureImageId)) {
//     throw new CustomError(codes.BAD_REQUEST, "Feature image id should have in media list!");
//   }
// };

const variantServices = {
//   createVariant,
//   getvariants,
//   updatevariant,
//   deletevariant,
  getVariantById,
};

export default variantServices;
