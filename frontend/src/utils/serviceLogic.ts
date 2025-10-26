// Service categories that should be treated as single-provider services
export const singleProviderCategories = [
  'Photography Services',
  'Videography Services', 
  'Beauty Services',
  'Music & Entertainment'
];

// Services that logically need only one provider but can handle multiple types
export const consolidatedServices = {
  'Photography Services': {
    mainService: 'photography-package',
    label: 'Photography Package',
    description: 'One photographer can handle all selected photography types'
  },
  'Videography Services': {
    mainService: 'videography-package', 
    label: 'Videography Package',
    description: 'One videographer can handle all selected videography types'
  },
  'Beauty Services': {
    mainService: 'beauty-package',
    label: 'Beauty Services Package', 
    description: 'Beauty services coordinated by professional team'
  }
};

export const isSingleProviderCategory = (categoryName: string): boolean => {
  return singleProviderCategories.includes(categoryName);
};

export const getConsolidatedService = (categoryName: string) => {
  return consolidatedServices[categoryName as keyof typeof consolidatedServices];
};