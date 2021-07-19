import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Table, { IColumn } from "../Table";
import { api } from "../../services/api";

interface IListViewProps {
  columns: IColumn[];
  endpoint: string;
  fetchCount: number;
}

const ListView: React.FC<IListViewProps> = ({
  columns,
  endpoint,
  fetchCount,
}) => {
  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get(endpoint);
      setRows(response.data);
    } catch (err) {
      toast.error(err?.response?.data?.errors[0]?.message);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCount]);

  return <Table columns={columns} rows={rows} />;
};

export default ListView;
