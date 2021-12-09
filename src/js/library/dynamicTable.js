import { parseValueToType } from "../library/utils/parseValueToType";
export class DynamicTableHandler {

  /**
   * Generate table wrapper, will returns the <table> element.
   * @returns <table> element.
   */
  generateTableWrapper() {
    const table = document.createElement("table");
    table.classList.add("table");
    return table;
  }

  /**
   * Generate table header wrapper, will returns the <thead> element.
   * @returns <thead> element.
   */
  generateTableHeadWrapper() {
    const thead = document.createElement("thead");
    return thead;
  }

  /**
   * Generate table head, will returns the <th> element.
   * @param {any} data Data to be insert into <th> element.
   * @returns <th> element.
   */
  generateTableHead(data) {
    const th = document.createElement("th");
    th.innerHTML = data;
    return th;
  }

  /**
   * Generate table body wrapper, will returns the <tbody> element.
   * @returns <tbody> element.
   */
  generateTableBodyWrapper() {
    const tbody = document.createElement("tbody");
    return tbody;
  }

  /**
   * Generate table row, will returns the <tr> element.
   * @return <tr> element.
   */
  generateTableRow() {
    const trRow = document.createElement("tr");
    return trRow;
  }

  /**
   * Generate table cell title, will return <td> title element
   * @param {any} value Data to be insert into <td> element.
   * @returns <td> element.
   * @example <td class="table-title" style="width: 150px; word-break: break-all; cursor: text;" data-key="{value}" type="{typeof (value)}">{value}</td>
   */
  generateTableCellTitle(value) {
    const tdKey = document.createElement("td");
    tdKey.classList.add("table-title");
    tdKey.style = "width: 150px; word-break: break-all; cursor: text;";
    tdKey.setAttribute("data-key", value);
    tdKey.setAttribute("type", typeof (value));
    tdKey.innerHTML = value;
    return tdKey;
  }

  /**
   * Generate table cell value, will return <td> value element
   * @param {any} value Data to be insert into <td> element.
   * @returns <td> element.
   * @example <td class="value" style="width: 150px; word-break: break-all; cursor: text;" data-json-key="{key}" type="{typeof (value)}" data-is-nested="{true|false}" data-nested-upper-key="{nestedUpperKey}">{value}</td>
   */
  generateTableCellValue(key, value, isNestedValue = false, nestedUpperKey = undefined) {
    const tdValue = document.createElement("td");
    tdValue.classList.add("value");
    tdValue.setAttribute("contenteditable", "false");
    tdValue.setAttribute("data-json-key", key);
    tdValue.setAttribute("type", typeof (value));

    if (isNestedValue === true && nestedUpperKey !== "undefined") {
      tdValue.setAttribute("data-is-nested", isNestedValue);
      tdValue.setAttribute("data-nested-upper-key", nestedUpperKey);
    }

    tdValue.style = "width: 150px; word-break: break-all; cursor: text;";
    tdValue.innerHTML = value;
    return tdValue;
  }

  /**
   * Generate dynamic table from json data.
   * @param {object} data Data to be insert into the <table> element.
   * @returns Entire <table> element.
   */
  generateDynamicTableFromJSONData(data) {

    try {

      if (typeof (data) !== "object") data = JSON.parse(data);

      const fragment = document.createDocumentFragment();
      const table = this.generateTableWrapper();
      const tbody = this.generateTableBodyWrapper();

      const thead = this.generateTableHeadWrapper();
      table.appendChild(thead);


      let isTHCreated = false;

      for (const [key, value] of Object.entries(data)) {
        const trRow = this.generateTableRow();

        // Insert table keys.
        const tdKey = this.generateTableCellTitle(key);
        trRow.appendChild(tdKey);

        // If contains nested keys.
        if (typeof (value) === "object") {

          const nestedKeys = Object.keys(value);
          const nestedValues = Object.values(value);

          // Table head.
          if (isTHCreated === false) {

            const thKey = this.generateTableHead("Name");
            thead.appendChild(thKey);

            nestedKeys.map((item) => {
              const thKey = this.generateTableHead(item);
              thead.appendChild(thKey);

              isTHCreated = true;
            });
          }

          // Handing nested value.
          for (let idx in nestedValues) {
            const tdValue = this.generateTableCellValue(nestedKeys[idx], nestedValues[idx], true, key);
            trRow.appendChild(tdValue);
          }

          fragment.appendChild(table);
        }

        else {
          const tdValue = this.generateTableCellValue(key, value);
          trRow.appendChild(tdValue);
        }

        tbody.appendChild(trRow);
        table.appendChild(tbody);
      }

      fragment.appendChild(table);
      return fragment;

    }
    catch (error) {
      console.log(`Error catch at ${this.generateDynamicTableFromJSONData.name}: ${error}`);
    }

  }


  /**
   * Parsed <table> element to json object.
   * @param {HTMLTableElement} element <table> element.
   * @returns Parsed json object.
   */
  parseTableToJSONObject(element) {

    // Select the target table.
    const table = element.querySelector("table");

    // Select the <th> table header. (For nested object.)
    const theads = Array.from(table.querySelectorAll("th")).map(item => item.textContent);

    let resultObj = {};

    // Check if the nested object. (<thead> is existing)
    if (theads.length > 0) {

      const objectKeys = Array.from(table.querySelectorAll("td[data-key]")).map(item => item.textContent);

      // Remove the first element "Name" field.
      theads.shift();


      // Nested keys.
      for (const i in objectKeys) {

        // Select the nested object upper keys.
        const objectValues = Array.from(table.querySelectorAll(`td[data-nested-upper-key='${objectKeys[i]}']`)).map(item => item.textContent);
        const objectTypes = Array.from(table.querySelectorAll(`td[data-nested-upper-key='${objectKeys[i]}']`)).map(item => item.getAttribute("type"));

       

        // E.g.:
        // {
        //   "INNO_GPIO_1": { },
        //   "INNO_GPIO_2": { },
        //   "INNO_GPIO_3": { },
        //   "INNO_GPIO_4": { },
        //   "INNO_GPIO_5": { },
        //   "INNO_GPIO_6": { }
        // }
        Object.assign(resultObj, { [objectKeys[i]]: {} });

        // Nested values.
        for (const j in objectValues) {

          // E.g.:
          // {
          //   "INNO_GPIO_1": { "DIRECTION":"in","VALUE":"1" },
          //   "INNO_GPIO_2": { "DIRECTION":"in","VALUE":"1" },
          //   "INNO_GPIO_3": { "DIRECTION":"in","VALUE":"1" },
          //   "INNO_GPIO_4": { "DIRECTION":"in","VALUE":"1" },
          //   "INNO_GPIO_5": { "DIRECTION":"in","VALUE":"1" },
          //   "INNO_GPIO_6": { "DIRECTION":"in","VALUE":"1" }
          // }

          console.log(objectValues[j], objectTypes[j]);
          Object.assign(resultObj[objectKeys[i]], { [theads[j]]: objectValues[j] });
          Object.assign(resultObj[objectKeys[i]], { [theads[j]]: parseValueToType(objectValues[j], objectTypes[j]) });
        }

      }

    }

    // Standard key value.
    else {

      const queryResult = table.querySelectorAll("td[data-json-key]");

      for (const item of queryResult) {
        Object.assign(resultObj, { [item.getAttribute("data-json-key")]: parseValueToType(item.textContent, item.getAttribute("type")) });
      }

    }

    return resultObj;

  }
}
