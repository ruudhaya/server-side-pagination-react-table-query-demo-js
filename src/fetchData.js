import axios from "axios";
export const fetchPokemonData = async (
  page,
  pageSize,
  setDataList,
  setHeaders
) => {
  try {
    const token =
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MDUxMzg2MDUsImlzcyI6Imh0dHBzOlwvXC9zbXMudW5pdGNoLmluIiwiYXVkIjoiaHR0cHM6XC9cL3Ntcy51bml0Y2guaW4iLCJuYmYiOjE3MDUxMzg2MDUsImV4cCI6MTcwNTIyNTAwNSwiZXh0cmFfZGF0YSI6W10sInJlc3RyaWN0X2lwIjpbXSwiaXNfYWdncmVtZW50X3ZvaWQiOjAsImFsbG93ZWRfYXBpcyI6bnVsbCwiZGF0YSI6eyJ1c2VybmFtZSI6Im1zbyIsInJvbGVMYWJlbCI6IkFkbWluaXN0cmF0b3IiLCJsYXN0TG9naW5BdCI6IjIwMjQtMDEtMTMgMTU6MDY6NDUiLCJzZXNzaW9uX2lkIjoiMSIsImF1dGhfa2V5IjoiNEV5LVV2NXpHak9yLXhYaUdJRkJZbFlndVhmcXFTQTIifSwianRpIjoyfQ.etbzH5lwMVTK1uklcLd1ddioTctF5k4fcoF-fHsQTEE";

    const response = await axios.get(
      `https://sms.unitch.in/api/index.php/v1/operator?expand=reg_phase_lbl,created_by_lbl,status_lbl,mso_lbl,state_lbl,district_lbl,city_lbl,username&filter[type]=1&page=${
        Number(page) + 1
      }&per-page=${pageSize}&vr=web1.0`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("response:" + JSON.stringify(response.headers));
    setDataList(response.data.data);
    setHeaders(response.headers);
    // return response;

    // const data = await response.data;
    // const headers = await response.headers;

    // console.log("Data after Fetch -", data);
    // return { data, headers };
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};
