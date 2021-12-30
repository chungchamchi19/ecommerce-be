import { OptionValueVariant } from "../../entities/optionValueVariant";
import { VariantResponse } from "../../types/type.variant";
import { Variant } from "../../entities/variant";

const formatVariant = (variant: Variant): VariantResponse => {
  const currentVariant: Variant = JSON.parse(JSON.stringify(variant));
  const newOptionValues =
    currentVariant.optionValueVariants?.map((optionValVar: OptionValueVariant) => {
      return {
        value: optionValVar?.optionValue?.value,
        position: optionValVar?.optionValue?.option?.position,
      };
    }) || [];
  const newOptions: string[] = newOptionValues.sort((left, right) => left.position - right.position).map((item) => item.value);
  delete currentVariant.optionValueVariants;
  return {
    ...currentVariant,
    options: newOptions,
    option1: newOptions.length >= 1 ? newOptions[0] : null,
    option2: newOptions.length >= 2 ? newOptions[1] : null,
    option3: newOptions.length >= 3 ? newOptions[2] : null,
    available: Number(currentVariant.availableNumber) > 0,
    publicTitle: newOptions.join(" / "),
  };
};

const variantHelpers = {
  formatVariant,
};

export default variantHelpers;
