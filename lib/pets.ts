export type SplitName = "train" | "validation" | "test";
export type AnimalKind = "cat" | "dog";

export type Pet = {
  id: number;
  split: SplitName;
  animal: AnimalKind;
  fluffiness: number;
  weight: number;
};

/** Pet positions adapted under CC BY-SA 4.0. */
export const PETS: Pet[] = [
  { id: 1, split: "train", animal: "cat", fluffiness: 0.3395684301, weight: 3.8497090733 },
  { id: 2, split: "train", animal: "cat", fluffiness: 0.9329005738, weight: 4.1921745764 },
  { id: 3, split: "train", animal: "cat", fluffiness: 1.4649664364, weight: 4.980204621 },
  { id: 4, split: "train", animal: "cat", fluffiness: -1.754603978, weight: 2.3205771242 },
  { id: 5, split: "train", animal: "cat", fluffiness: 3.3171174006, weight: 1.4309180305 },
  { id: 6, split: "validation", animal: "cat", fluffiness: 5.969038196, weight: 5.4902168132 },
  { id: 7, split: "train", animal: "cat", fluffiness: 4.2734221774, weight: 1.3867782915 },
  { id: 8, split: "test", animal: "cat", fluffiness: 1.7798907274, weight: -0.4432623166 },
  { id: 9, split: "validation", animal: "cat", fluffiness: 0.9958266626, weight: 2.2605570081 },
  { id: 10, split: "train", animal: "cat", fluffiness: 1.9513266053, weight: 3.4254536937 },
  { id: 11, split: "train", animal: "cat", fluffiness: 0.7102687647, weight: 2.5828849987 },
  { id: 12, split: "test", animal: "cat", fluffiness: 2.2935555279, weight: 4.1506316501 },
  { id: 13, split: "train", animal: "cat", fluffiness: 1.243045228, weight: 5.0072872251 },
  { id: 14, split: "validation", animal: "cat", fluffiness: 1.3801740281, weight: 1.8401170569 },
  { id: 15, split: "train", animal: "cat", fluffiness: 2.2194120188, weight: 3.7368825622 },
  { id: 16, split: "test", animal: "cat", fluffiness: 1.1446295763, weight: -0.7676447929 },
  { id: 17, split: "train", animal: "cat", fluffiness: 4.9640417147, weight: 4.5967988261 },
  { id: 18, split: "validation", animal: "cat", fluffiness: 3.585817288, weight: 3.2829857923 },
  { id: 19, split: "validation", animal: "cat", fluffiness: 5.1693458925, weight: 0.3535120496 },
  { id: 20, split: "test", animal: "cat", fluffiness: 1.0451056615, weight: 2.3045578302 },
  { id: 21, split: "test", animal: "cat", fluffiness: 1.0740808468, weight: 0.1892981831 },
  { id: 22, split: "test", animal: "cat", fluffiness: 0.7764178017, weight: 1.9052039509 },
  { id: 23, split: "train", animal: "cat", fluffiness: 2.6598947539, weight: 0.0559172102 },
  { id: 24, split: "train", animal: "cat", fluffiness: 2.1372303538, weight: 3.9144280381 },
  { id: 25, split: "test", animal: "cat", fluffiness: 3.4749431662, weight: 5.1588436095 },
  { id: 26, split: "train", animal: "cat", fluffiness: 2.8535408727, weight: 0.6913539509 },
  { id: 27, split: "train", animal: "cat", fluffiness: 4.1249118506, weight: 2.5370126092 },
  { id: 28, split: "validation", animal: "cat", fluffiness: 8.456993295, weight: 7.6355901615 },
  { id: 29, split: "validation", animal: "cat", fluffiness: 4.8289402678, weight: 2.2588681402 },
  { id: 30, split: "test", animal: "cat", fluffiness: 4.7317139061, weight: 4.5245785086 },
  { id: 31, split: "validation", animal: "cat", fluffiness: -0.020449048, weight: 6.7229624238 },
  { id: 32, split: "train", animal: "cat", fluffiness: 0.3980243841, weight: 1.5793157914 },
  { id: 33, split: "test", animal: "cat", fluffiness: 1.1194665869, weight: 3.0749664648 },
  { id: 34, split: "test", animal: "dog", fluffiness: 4.1798149279, weight: 3.7530702897 },
  { id: 35, split: "validation", animal: "dog", fluffiness: 3.430356098, weight: 4.9522229119 },
  { id: 36, split: "validation", animal: "dog", fluffiness: 4.1092221307, weight: 5.1129316259 },
  { id: 37, split: "test", animal: "dog", fluffiness: 4.3597474532, weight: 4.8591861099 },
  { id: 38, split: "train", animal: "dog", fluffiness: 4.1680410042, weight: 4.2694119763 },
  { id: 39, split: "train", animal: "dog", fluffiness: 4.3136539571, weight: 4.8750020036 },
  { id: 40, split: "validation", animal: "dog", fluffiness: 2.9295977765, weight: 3.5141707844 },
  { id: 41, split: "train", animal: "dog", fluffiness: 4.7573689612, weight: 6.3884272365 },
  { id: 42, split: "train", animal: "dog", fluffiness: 6.0135223606, weight: 4.2875695824 },
  { id: 43, split: "train", animal: "dog", fluffiness: 3.1238974229, weight: 5.9264108312 },
  { id: 44, split: "train", animal: "dog", fluffiness: 5.8386068945, weight: 4.8610556341 },
  { id: 45, split: "train", animal: "dog", fluffiness: 2.8963612818, weight: 5.6217562101 },
  { id: 46, split: "validation", animal: "dog", fluffiness: 4.7228669078, weight: 3.5962935509 },
  { id: 47, split: "train", animal: "dog", fluffiness: 4.0018535795, weight: 3.6803748587 },
  { id: 48, split: "test", animal: "dog", fluffiness: 4.3172921474, weight: 5.1232517288 },
  { id: 49, split: "test", animal: "dog", fluffiness: 3.6360179255, weight: 7.3927980009 },
  { id: 50, split: "train", animal: "dog", fluffiness: 5.5713447453, weight: 6.1974414184 },
  { id: 51, split: "validation", animal: "dog", fluffiness: 5.4478954122, weight: 4.4923585338 },
  { id: 52, split: "validation", animal: "dog", fluffiness: 7.0171795504, weight: 5.0476809105 },
  { id: 53, split: "test", animal: "dog", fluffiness: 5.3263760362, weight: 3.3503760428 },
  { id: 54, split: "train", animal: "dog", fluffiness: 3.1220500159, weight: 5.5761419998 },
  { id: 55, split: "validation", animal: "dog", fluffiness: 3.8820683137, weight: 6.1581615814 },
  { id: 56, split: "train", animal: "dog", fluffiness: 5.961141133, weight: 6.1566959577 },
  { id: 57, split: "test", animal: "dog", fluffiness: 4.9399098656, weight: 6.768915416 },
  { id: 58, split: "train", animal: "dog", fluffiness: 3.0794095057, weight: 4.5547527302 },
  { id: 59, split: "train", animal: "dog", fluffiness: 5.2144455712, weight: 3.7487027893 },
  { id: 60, split: "validation", animal: "dog", fluffiness: 4.2903883693, weight: 5.8219822698 },
  { id: 61, split: "test", animal: "dog", fluffiness: 5.7338553022, weight: 5.1246676088 },
  { id: 62, split: "train", animal: "dog", fluffiness: 3.9063076337, weight: 4.4531077178 },
];

export const SPLIT_COLOR: Record<SplitName, string> = {
  train: "#2D3142",
  validation: "#058ED9",
  test: "#FF934F",
};
