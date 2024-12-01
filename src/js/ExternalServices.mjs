function convertToJson(res) {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Bad Response");
    }
  }

export default class ExternalServices {
    constructor(baseURL) {
      this.baseURL = baseURL;
    }
  
    async fetchData(endpoint) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    async checkout(order) {
      const url = `${this.baseURL}/checkout`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      };
  
      try {
        const response = await fetch(url, options).then(convertToJson);
        if (!response.ok) throw new Error("Failed to submit order");
        return await response.json();
      } catch (error) {
        console.error("Error during checkout:", error);
      }
    }
  }
  