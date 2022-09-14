import { atom } from "recoil";
import {
  allPortfolioBoughtAssets,
  allPortfolioBoughtAssetsFromAPI,
} from "./selector";

export const allPortfolioAssets = atom({
  key: "allPortfolioAssets",
  default: allPortfolioBoughtAssetsFromAPI,
});

export const allPortfolioBoughtAssetsInStorage = atom({
  key: "assetsInStorage",
  default: allPortfolioBoughtAssets,
});
