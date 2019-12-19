import React from "react";
import { News } from "../../styles/GlobalStyle";
import * as ROUTES from "../../constants/routes";

const NewsPage = () => (
  <News>
    <h1>News</h1>
    <p>API med nyheter från wowhead/icy-veins{"(?)"}</p>
  </News>
);

export default NewsPage;
