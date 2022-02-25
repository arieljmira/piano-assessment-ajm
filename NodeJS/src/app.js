// Node.js program as part of Piano Assessment

const readCSVfile = require("./readCSVfile"); // Importing the function that reads a given CSV file and returns an Array (Async function)
const getExistingUsers = require("./getExistingUsers"); // Importing the function that fetch data from the user's API endpoint
const objectsToCSV = require("objects-to-csv"); // npm library used to save array objects into CSV files on disk

const main = async () => {
  try {
    const dataA = await readCSVfile("./input_files/A.csv"); // Loading File A into Array dataA
    const dataB = await readCSVfile("./input_files/B.csv"); // Loading File B into Array dataA
    const existingUsers = await getExistingUsers(); // It gets existing users in the system by using the /publisher/user/list API Endpoint

    const mergedArray = []; // Declaring the final mergedArray
    const notFoundArray = []; // Declaring an Array with IDs not found

    dataA.forEach((rowA, x) => {
      // For each record in File A
      dataB.forEach((rowB, y) => {
        // Read every record in File B trying to find a match based on user_id
        if (rowA.user_id === rowB.user_id) {
          // Some user IDs are incorrect because these users already exist in the system under different user_id values.
          // Make sure that for the incorrect records, user_id is taken from the system, rather than from the list provided from the client.

          const userFound = existingUsers.find(
            (user) => user.email === rowA.email
          );

          const id = userFound ? userFound.uid : rowA.user_id;

          mergedArray.push({
            // If the user_id is the same in File A and File B
            user_id: id,
            email: rowA.email,
            first_name: rowB.first_name,
            last_name: rowB.last_name,
          });
          dataB.splice(y, 1); // Removing record from File B once the match is done (less iterations in future loops)
        }
      });
      // Push user_id from File A not found in File B
      if (mergedArray.length <= notFoundArray.length + x) {
        notFoundArray.push({
          user_id: rowA.user_id,
        });
      }
    });

    // Push all the user_ids from File B not found in File A
    dataB.forEach((rowB) => {
      notFoundArray.push({
        user_id: rowB.user_id,
      });
    });

    const csvSuccess = new objectsToCSV(mergedArray);
    await csvSuccess.toDisk("./output_files/success.csv");

    const csvErrors = new objectsToCSV(notFoundArray);
    await csvErrors.toDisk("./output_files/errors.csv");
  } catch (error) {
    console.log("Error: " + error);
  }
};

main(); // Run the program
