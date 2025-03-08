
export default function handleRowReorder(
      myRawData: any,
      selectedRowIndexes: number[],
      destinationRowIdx: number,
      updateData: (data: any) => void
    ) {
      const prevData = [...myRawData].sort((a, b) => a.position - b.position);
      //const prevData = [...data];
      console.log("selectedRowIndexes: ", selectedRowIndexes)
      console.log("destinationRowIdx: ", destinationRowIdx)
      console.log("prevData: ", prevData)
      // Adjust the destination index to account for the header row.
      // NOT THE CASE HERE: Header row is not part of data
      const adjustedDestinationIdx = destinationRowIdx - 1
      const adjustedSelectedRowIdxs = selectedRowIndexes.map((rowIdx) => rowIdx - 1)
      //const adjustedDestinationIdx = destinationRowIdx
      //const adjustedSelectedRowIdxs = selectedRowIndexes.map((rowIdx) => rowIdx)
      const isReorderingUpwards = adjustedSelectedRowIdxs.some((rowIdx) => rowIdx > adjustedDestinationIdx)
      adjustedSelectedRowIdxs.forEach((rowIdx, index) => {
        if (adjustedDestinationIdx === 0) {
          prevData[rowIdx].position = prevData[adjustedDestinationIdx].position / 2 + index * 0.0001;
        } else if (adjustedDestinationIdx === myRawData.length - 1) {
          prevData[rowIdx].position = prevData[adjustedDestinationIdx].position + 1 + index * 0.0001;
        } else if (isReorderingUpwards) {
          prevData[rowIdx].position = (prevData[adjustedDestinationIdx].position + prevData[adjustedDestinationIdx - 1].position) / 2 + index * 0.0001;
        } else {
          prevData[rowIdx].position = (prevData[adjustedDestinationIdx].position + prevData[adjustedDestinationIdx + 1].position) / 2 + index * 0.0001;
        }
      });
      const prevDataAfterMove = [...prevData].sort((a, b) => a.position - b.position);
      console.log("prevData after move: ", prevDataAfterMove)
      updateData(prevDataAfterMove)
      //prevData.forEach((row) => { updateData(row.id, "position", row.position); })
    }

