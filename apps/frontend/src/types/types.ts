import type { NextPage } from "next";
import { FC } from "react";

export type Layout = FC<{ children: JSX.Element }>;
export type NextPageWithLayout = NextPage & { Layout?: Layout };
