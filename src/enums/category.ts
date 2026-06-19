export enum CategoryEnum {
  WebDevelopment = "web_development",
  MobileDevelopment = "mobile_development",
  Design = "design",
  UIUX = "ui_ux",
  DataScience = "data_science",
  MachineLearning = "machine_learning",
  CloudComputing = "cloud_computing",
  AWS = "aws",
  FullStack = "full_stack",
}

export const CategoryLabels: Record<CategoryEnum, string> = {
  [CategoryEnum.WebDevelopment]: "Web Development",
  [CategoryEnum.MobileDevelopment]: "Mobile Development",
  [CategoryEnum.Design]: "Design",
  [CategoryEnum.UIUX]: "UI/UX",
  [CategoryEnum.DataScience]: "Data Science",
  [CategoryEnum.MachineLearning]: "Machine Learning",
  [CategoryEnum.CloudComputing]: "Cloud Computing",
  [CategoryEnum.AWS]: "AWS",
  [CategoryEnum.FullStack]: "Full Stack",
};

export const getCategoryLabel = (category: string | null): string => {
  if (!category) return "All Courses";
  return CategoryLabels[category as CategoryEnum] || category;
};
