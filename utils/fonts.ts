import { Anton, Antonio } from "next/font/google";

export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export const antonio = Antonio({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--font-antonio",
});
