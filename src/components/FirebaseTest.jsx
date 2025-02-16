import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { Box, Button, Typography } from "@mui/material";

export const FirebaseTest = () => {
  const [message, setMessage] = useState("");
  const [testData, setTestData] = useState([]);

  const addTestData = async () => {
    try {
      const docRef = await addDoc(collection(db, "testCollection"), {
        message: "Hello Firebase",
        timestamp: new Date(),
      });
      setMessage(`Document written with ID: ${docRef.id}`);
    } catch (error) {
      setMessage(`Error adding document: ${error.message}`);
    }
  };

  const fetchTestData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "testCollection"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestData(data);
      setMessage("Data fetched successfully");
    } catch (error) {
      setMessage(`Error fetching documents: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Firebase Connection Test
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={addTestData}
        sx={{ mr: 2 }}
      >
        Add Test Data
      </Button>

      <Button variant="contained" color="secondary" onClick={fetchTestData}>
        Fetch Test Data
      </Button>

      <Typography>{message}</Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Test Data</Typography>
        {testData?.map((data) => (
          <Box key={data.id} sx={{ mb: 1 }}>
            <Typography>
              ID: {data.id}
            </Typography>
            <Typography>
              Message: {data.message}
            </Typography>
            <Typography>
              Timestamp:{" "} {data.timestamp?.toDate().toString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
