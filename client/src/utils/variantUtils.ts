import type { OptionData } from '@/components/admin/products/products-form/form-Variant-Settings/form-VariantInput';

export interface Sku {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  variantValues: { optionName: string; value: string }[];
}

/**
 * Generates all possible combinations (Cartesian product) from a list of options.
 * @param options - An array of OptionData objects, each with a name and an array of values.
 * @returns An array of Sku objects, each representing a unique variant.
 */
export const generateSKUs = (options: OptionData[]): Sku[] => {
  if (!options || options.length === 0 || options.some(opt => !opt.values || opt.values.length === 0)) {
    return [];
  }

  const activeOptions = options.filter(opt => opt.name.trim() !== '' && opt.values.length > 0 && opt.values.some(v => v.trim() !== ''));
  if (activeOptions.length === 0) {
    return [];
  }

  const valueArrays = activeOptions.map(opt => opt.values.filter(v => v.trim() !== ''));

  const cartesianProduct = <T,>(...arrays: T[][]): T[][] => {
    return arrays.reduce<T[][]>(
      (acc, current) => {
        return acc.flatMap(a => {
          return current.map(c => [...a, c]);
        });
      },
      [[]]
    );
  };

  const combinations = cartesianProduct(...valueArrays);

  return combinations.map((combo, index) => {
    const name = combo.join(' / ');
    const id = combo.join('-');

    const variantValues = combo.map((value, i) => ({
      optionName: activeOptions[i].name,
      value: value,
    }));

    return {
      id,
      name,
      price: 0,
      stock: 0,
      variantValues,
    };
  });
};

/**
 * Generates a URL-friendly and API-friendly variant name from its values.
 * @param variantValues - An array of variant value objects.
 * @returns A lowercase string with values joined by hyphens.
 */
export const generateApiVariantName = (variantValues: { value: string }[]): string => {
  return variantValues.map(v => v.value).join('-').toLowerCase();
};
