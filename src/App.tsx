import "./App.css";
import yFilesLicense from "A:\\yfiles\\yFiles-for-HTML\\lib\\license.json";
import data from "./optimized_records.json";
import { useState, useCallback, useEffect, useMemo } from "react";
import {
  CustomOrgChartItem,
  OrgChart,
  registerLicense,
  Overview,
  Controls,
  OrgChartControlButtons,
  useOrgChartContext,
  OrgChartProvider,
  RenderItemProps,
} from "@yworks/react-yfiles-orgchart";
import "@yworks/react-yfiles-orgchart/dist/index.css";
import { debounce } from "lodash"; // Using lodash for debounce
import React from "react";

registerLicense(yFilesLicense);

function OrgChartWrapper() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleData, setVisibleData] = useState([]);
  const [dataChunkSize] = useState(50); // Load 50 records at a time
  const { fitContent, zoomToItem, zoomToOriginal } = useOrgChartContext()!;

  useEffect(() => {
    // Load initial data chunk
    setVisibleData(data.slice(0, dataChunkSize));
  }, [dataChunkSize]);

  const loadMoreData = useCallback(() => {
    // Load more data when needed
    setVisibleData((prevData) => [
      ...prevData,
      ...data.slice(prevData.length, prevData.length + dataChunkSize),
    ]);
  }, [dataChunkSize]);

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300), // Debounce search input to optimize performance
    [],
  );

  const onItemSelect = useCallback(
    (selectedItems: CustomOrgChartItem[]) =>
      // console.log(
      //   selectedItems.length
      //     ? `Selected: ${selectedItems[0].name}`
      //     : "Nothing selected",
      // ),
         selectedItems.length
          ? zoomToItem(selectedItems[0])
          : "Nothing selected",
    [],
  );

  type Employee = {
    name?: string;
    status?: string;
    position?: string;
    email?: string;
    phone?: string;
  };
  

  function MyOrgChartItem(props: RenderItemProps<CustomOrgChartItem<Employee>>) {
    const { dataItem } = props;
    return (
      <div
        className={`${dataItem.name === "Eric Joplin" ? "ceo" : "employee"} item`}
      >
        <div>{dataItem.name}</div>
      </div>
    );
  }

 
  return (
    <>
      <input
        className="search"
        type="search"
        placeholder="Search..."
        onChange={(event) => handleSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            zoomToItem(searchQuery); // Zoom to the item
          }
        }}
      />
      <button className="loadmore" onClick={loadMoreData}>
        Load More
      </button>
      <OrgChart
        className="graph"
        onItemSelect={onItemSelect}
        searchNeedle={searchQuery}
     //   renderItem={MyOrgChartItem}
        data={data} // Use filtered data based on the search
        renderContextMenu={({ item }) => (
          <button onClick={() => alert(`${item?.name} clicked!`)}>
            Click here!
          </button>
        )}
      >
        <Overview />
        <Controls buttons={OrgChartControlButtons} />
      </OrgChart>
    </>
  );
}

const MemoizedOrgChartWrapper = React.memo(OrgChartWrapper);

function App() {
  return (
    <div className="bodywrapper">
    <OrgChartProvider>
      <MemoizedOrgChartWrapper />
    </OrgChartProvider>
    </div>
  );
}

export default App;
