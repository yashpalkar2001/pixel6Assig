import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import "primeicons/primeicons.css";

function App() {
  const [country, setCountry] = useState();
  const [gender, setGender] = useState();
  const [limit, setLimit] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [sortType, setSortType] = useState([]);

  const optionCountry = [
    { name: "India", value: "India" },
    { name: "USA", value: "United States" },
  ];
  const optionGender = [
    { name: "All", value: "all" },
    { name: "Male", value: "male" },
    { name: "Female", value: "female" },
  ];

  const headerData = [
    {
      name: "Id",
      icon: (
        <i
          className="pi pi-sort-alt mx-2 cursor-pointer"
          style={{ fontSize: "1rem" }}
        ></i>
      ),
      clickfn: () => {
        sortingId();
      },
    },
    { name: "Image", icon: "" },
    {
      name: "Full Name",
      icon: (
        <i
          className="pi pi-sort-alt mx-2 cursor-pointer"
          style={{ fontSize: "1rem" }}
        ></i>
      ),
      clickfn: () => {
        sortingName();
      },
    },
    {
      name: "Demography",
      icon: (
        <i
          className="pi pi-sort-alt mx-2 cursor-pointer"
          style={{ fontSize: "1rem" }}
        ></i>
      ),
      clickfn: () => {
        sortingAge();
      },
    },
    { name: "Designation", icon: "" },
    { name: "Location", icon: "" },
  ];

  //fetching data from given API
  const getData = async () => {
    const resp = await fetch(`https://dummyjson.com/users?limit=${limit}`)
      .then((value) => value.json())
      .then((value) => {
        return value;
      })
      .catch((error) => {
        console.log(error);
      });

    const result = resp.users;

    setTableData([...result]);
    handleFilter([...result]);
  };

  useEffect(() => {
    getData();
  }, [limit]);

  // for infinite scorlling and getting updated scroll value
  const handleScroll = () => {
    const scrolled =
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight;

    if (scrolled) {
      setLimit((prev) => prev + 10);
    }
  };

  // for handling Dropdown like gender and country
  const handleFilter = (data) => {
    if (gender !== "all" && country) {
      const filterGenderAndCoun = data.filter(
        (item) => item.gender == gender && item.address.country == country
      );
      setFilterData(filterGenderAndCoun);
    } else if (country) {
      const filterCountry = data.filter(
        (item) => item.address.country == country
      );
      setFilterData(filterCountry);
    } else if (gender) {
      const filterGender = data.filter((item) => item.gender == gender);
      setFilterData(filterGender);
    } else if (gender == "all") {
      setFilterData(data);
    } else {
      setFilterData(data);
    }
  };

  // this for id sorting
  const sortingId = () => {
    const sortId = filterData.sort((a, b) => b.id - a.id);

    setSortType(sortId);
    setFilterData([...sortType]);
    // console.log("this is sorted function", sortId);
  };

  // this for name sorting
  const sortingName = () => {
    const sortName = filterData.sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );

    setSortType(sortName);
    setFilterData(sortName);
    // console.log("this is sorted function", sortName);
  };

  // this for age sorting
  const sortingAge = () => {
    const sortAge = filterData.sort((a, b) => b.age - a.age);

    setSortType(sortAge);
    setFilterData([...sortType]);
    // console.log("this is sorted function", sortAge);
  };

  // for each time updating scroll value
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    handleFilter(tableData);
  }, [gender, country, sortType]);

  return (
    <>
      <div className="p-[2rem] lg:p-[10rem]">
        <div className="flex justify-between items-center">
          <h2 className="text-[3rem]">Employees</h2>
          <div className="flex flex-col mt-5 items-center gap-5 lg:flex-row">
            <i
              className="pi pi-filter-fill text-red-600 hidden lg:inline-block"
              style={{ fontSize: "1.5rem" }}
            ></i>
            <Dropdown
              value={country}
              onChange={(e) => {
                setCountry(e.value);
                // console.log(e.value);
              }}
              options={optionCountry}
              optionLabel="name"
              className="w-full border border-gray-400 text-[1.5rem] rounded px-3 mx-5"
              placeholder="Countery"
            />
            <Dropdown
              value={gender}
              onChange={(e) => {
                setGender(e.value);
                // console.log(e.value);
              }}
              options={optionGender}
              optionLabel="name"
              placeholder="Gender"
              className="w-full border border-gray-400 text-[1.5rem] rounded mx-5 px-3"
            />
          </div>
        </div>
        <div className="border border-gray-300 rounded-2xl w-full mt-10 shadow overflow-x-scroll">
          <table className=" w-full">
            <thead className="border-b border-gray-300">
              <tr className="text-[1.5rem] text-left">
                {headerData.map((item, index) => (
                  <th key={index} className="p-5" onClick={item.clickfn}>
                    {item.name}
                    {item.icon}
                  </th>
                ))}
              </tr>
            </thead>

            {filterData.length > 0 ? (
              filterData.map((item, i) => (
                <tbody
                  className="text-[1.5rem] text-center border-b border-gray-300 "
                  key={i}
                >
                  <tr className="text-left">
                    <td className="px-4">{item.id}</td>
                    <td className=" p-3 w-[10%]">
                      <img
                        src={item.image}
                        className="rounded-full w-[70%] mx-2 md:w-[40%] lg:w-[25%]"
                      />
                    </td>
                    <td className="px-4">
                      {item.firstName} {item.maidenName} {item.lastName}
                    </td>
                    <td className="px-4">
                      {item.gender.toUpperCase().charAt(0)}/{item.age}
                    </td>
                    <td className="px-4">{item.company.title}</td>
                    <td className="px-4">{item.address.state}, USA</td>
                  </tr>
                </tbody>
              ))
            ) : (
              <div colSpan={6} className=" text-[3rem] ">
                <span className="w-full text-center ">
                  <i className="pi pi-spin pi-spinner mx-3"></i>Loading......
                </span>
              </div>
            )}
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
