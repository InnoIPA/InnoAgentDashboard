import { parseValueToType } from "../library/utils/parseValueToType";
export class GPIOTableHandler {

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
    const td = document.createElement("td");
    td.classList.add("value");
    td.setAttribute("contenteditable", "false");
    td.setAttribute("data-json-key", key);
    td.setAttribute("type", typeof (value));

    if (isNestedValue === true && nestedUpperKey !== "undefined") {
      td.setAttribute("data-is-nested", isNestedValue);
      td.setAttribute("data-nested-upper-key", nestedUpperKey);
    }

    td.style = "width: 150px; word-break: break-all; cursor: text;";
    td.innerHTML = value;
    return td;
  }


  generateGPIODirectionValue(key, value, isNestedValue = false, nestedUpperKey = undefined) {

    const td = document.createElement("td");
    // td.setAttribute("data-json-key", key);
    // td.setAttribute("type", typeof (value));

    if (isNestedValue === true && nestedUpperKey !== "undefined") {
      td.setAttribute("data-is-nested", isNestedValue);
      td.setAttribute("data-nested-upper-key", nestedUpperKey);
      td.innerHTML = `
      <div class="switch-field">
         <input class="input" type="radio" id="${nestedUpperKey + "_" + "input"}" name="${nestedUpperKey}" value="in" data-json-key="${key}" ${(value === "in") ? "checked" : ""} disabled />
         <label for="${nestedUpperKey + "_" + "input"}">Input</label>
         <input class="output" type="radio" id="${nestedUpperKey + "_" + "output"}" name="${nestedUpperKey}" value="out" data-json-key="${key}" ${(value === "out") ? "checked" : ""} disabled/>
         <label for="${nestedUpperKey + "_" + "output"}">Output</label>
      </div>
    `;
    }

    td.style = "width: 150px; word-break: break-all;";

    return td;
  }

  generateGPIOValueOption(key, value, isNestedValue = false, nestedUpperKey = undefined) {
    const td = document.createElement("td");
    // td.setAttribute("data-json-key", key);
    // td.setAttribute("type", typeof (value));

    if (isNestedValue === true && nestedUpperKey !== "undefined") {
      td.setAttribute("data-is-nested", isNestedValue);
      td.setAttribute("data-nested-upper-key", nestedUpperKey);
      td.innerHTML = `
      <select name="${nestedUpperKey}" id="${nestedUpperKey}" data-json-key="${key}" class="form-control GPIO_value" aria-label="GPIO value" style="width:150px;" disabled>
        <option type="${typeof (value)}" value="0" ${(value === "0") ? "selected" : ""}>low (0)</option>
        <option type="${typeof (value)}" value="1" ${(value === "1") ? "selected" : ""}>high (1)</option>
      </select>
    `;
    }

    td.style = "width: 150px; word-break: break-all;";

    return td;
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


            // GPIO value.
            if (nestedKeys[idx] === "VALUE") {
              const tdValue = this.generateGPIOValueOption(nestedKeys[idx], nestedValues[idx], true, key);
              trRow.appendChild(tdValue);
            }

            // GPIO direction.
            if (nestedKeys[idx] === "DIRECTION") {
              const tdValue = this.generateGPIODirectionValue(nestedKeys[idx], nestedValues[idx], true, key);
              trRow.appendChild(tdValue);
            }

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


    let resultObj = {};

    const gpioDirectionSwitches = Array.from(element.querySelectorAll("td input[type=\"radio\"]:checked"));
    const gpioValueSelectors = Array.from(element.querySelectorAll("td select"));

    if (gpioDirectionSwitches.length > 0 && gpioValueSelectors.length > 0) {

      // gpioToggleSwitches.length= 16, each row has two radio button.
      for (let i = 0; i < gpioDirectionSwitches.length; i++) {

        // GPIO toggle switches.
        const css = ".switch-field label:hover{ cursor: pointer; }";
        const style = document.createElement("style");

        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        // GPIO direction switch style.

        gpioDirectionSwitches[i].appendChild(style);
        gpioDirectionSwitches[i].removeAttribute("disabled");

        // GPIO value selector style.
        gpioValueSelectors[i].removeAttribute("disabled");


        // Cache the current value
        // E.g.:
        // {
        //   "INNO_GPIO_1": { },
        //   "INNO_GPIO_2": { },
        //   "INNO_GPIO_3": { },
        //   "INNO_GPIO_4": { },
        //   "INNO_GPIO_5": { },
        //   "INNO_GPIO_6": { }
        // }
        Object.assign(resultObj, { [gpioDirectionSwitches[i].getAttribute("name")]: {} });


        // E.g.:
        // {
        //   "INNO_GPIO_1": { "DIRECTION":"in","VALUE":"1" },
        //   "INNO_GPIO_2": { "DIRECTION":"in","VALUE":"1" },
        //   "INNO_GPIO_3": { "DIRECTION":"in","VALUE":"1" },
        //   "INNO_GPIO_4": { "DIRECTION":"in","VALUE":"1" },
        //   "INNO_GPIO_5": { "DIRECTION":"in","VALUE":"1" },
        //   "INNO_GPIO_6": { "DIRECTION":"in","VALUE":"1" }
        // }
        Object.assign(resultObj[gpioDirectionSwitches[i].getAttribute("name")], { [gpioDirectionSwitches[i].getAttribute("data-json-key")]: parseValueToType(gpioDirectionSwitches[i].value, gpioDirectionSwitches[i].getAttribute("type")) });
        Object.assign(resultObj[gpioDirectionSwitches[i].getAttribute("name")], { [gpioValueSelectors[i].getAttribute("data-json-key")]: parseValueToType(gpioValueSelectors[i].value, gpioValueSelectors[i].getAttribute("type")) });

      }

    }

    console.log(resultObj);
    return resultObj;
  }
}
