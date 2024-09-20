import "./App.css";
import yFilesLicense from "/Users/wahida/Documents/yfiles/yFiles-for-HTML/lib/license.json";
import data from "./data.json";
import { useState, useCallback } from "react";
registerLicense(yFilesLicense);

//our application has now the following features:
//an application context that allows us to interact with the graph, done through function orgchartwrapper
//an overview and toolbar
//a search bar
// registration of when an item is selected, so that i can update a bar on the right side with a persons details(and their subordinates(cheeky i know))

//we can use renderOrgChartItem function in order to separate the different nodes that we have
import {
  CustomOrgChartItem,
  OrgChart,
  registerLicense,
  Overview,
  Controls,
  OrgChartControlButtons,
  useOrgChartContext,
  OrgChartProvider,
} from "@yworks/react-yfiles-orgchart";

import "@yworks/react-yfiles-orgchart/dist/index.css";

registerLicense(yFilesLicense);

function OrgChartWrapper() {
  const [searchQuery, setSearchQuery] = useState("");
  const { fitContent, zoomToItem, zoomToOriginal } = useOrgChartContext()!;
  const onItemSelect = useCallback(
    //this method will allow me to display the specific information in a sidebar
    (selectedItems: CustomOrgChartItem[]) =>
      console.log(
        selectedItems.length
          ? `selected: ${selectedItems[0].name}`
          : "nothing selected",
      ),
    [],
  );
  return (
    <>
      <input
        //the search button we will use
        className="search"
        type={"search"}
        placeholder="Search..."
        onChange={(event) => {
          setSearchQuery(event.target.value);
        }}
        onKeyDown={(event) => {
          // Check if the Enter key is pressed
          if (event.key === "Enter") {
            // Call zoomToItem with the search query
            zoomToItem(searchQuery); // FIGURE OUT HOW TO ZOOM TO THE ITEM :D
          }
        }}
      ></input>
      <OrgChart
        className="graph"
        onItemSelect={onItemSelect}
        searchNeedle={searchQuery}
        onSearch={(data: CustomOrgChartItem, searchQuery: string) =>
          data?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        }
        data={data}
        renderContextMenu={({ item }) => (
          //use to create something when you right click a node (can be used for navigation, for any options)
          <button onClick={() => alert(`${item?.name} c licked!`)}>
            Click here!
          </button>
        )}
      >
        <Overview></Overview>
        <Controls buttons={OrgChartControlButtons}></Controls>
      </OrgChart>
    </>
  );
}

function App() {
  return (
    <OrgChartProvider>
      <OrgChartWrapper></OrgChartWrapper>
    </OrgChartProvider>
  );
}

export default App;
