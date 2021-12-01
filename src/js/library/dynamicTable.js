export const generateDynamicTableFromJSONData = (data) => {

  if (typeof (data) !== "object") data = JSON.parse(data);

  const fragment = document.createDocumentFragment();
  const table = document.createElement("table");
  table.classList.add("table");
  const thead = document.createElement("thead");

  table.appendChild(thead);

  for (const [key, value] of Object.entries(data)) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="${key}">${key}</td>
      <td class="value" id="${key}">${(typeof (value) !== "string") ? JSON.stringify(value) : value}</td>
      `;

    thead.appendChild(tr);
  }

  fragment.appendChild(table);
  return fragment;
};