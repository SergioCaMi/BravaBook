        let photoCount = 0;
        // let urls = [];

        // ********** Función para añadir imagenes **********
        function addPhotoField() {
            const container = document.getElementById('photosContainer');
            const fieldset = document.createElement('fieldset');
            fieldset.className = 'photo-fieldset';
            fieldset.innerHTML = `
      <legend>Foto #${photoCount + 1}</legend>

      <label for="photos[${photoCount}][url]">URL de la foto:</label>
      <input type="text" name="photos[${photoCount}][url]" required />

      <label for="photos[${photoCount}][description]">Descripción:</label>
      <input type="text" name="photos[${photoCount}][description]" />

      <label>
        <input type="radio" name="mainPhotoIndex" value="${photoCount}" ${photoCount === 0 ? 'checked' : ''} />
        Foto Principal
      </label>

      <hr />
    `;
            container.appendChild(fieldset);
            photoCount++;
        }



        // ********** Función para añadir camas **********
        document.addEventListener("DOMContentLoaded", () => {
            const roomsInput = document.getElementById("rooms");
            const bedsContainer = document.getElementById("bedsContainer");

            if (!roomsInput || !bedsContainer) {
                console.error("No se encontraron los elementos del DOM");
                return;
            }

function generateBedInputs() {
    const roomCount = parseInt(document.getElementById("rooms").value) || 0;
    const bedsContainer = document.getElementById("bedsContainer");
    bedsContainer.innerHTML = ""; // Limpiar contenido anterior

    if (roomCount <= 0) return;

    // Título
    const title = document.createElement("h6");
    title.textContent = "Camas por habitación:";
    title.className = "mb-3";
    bedsContainer.appendChild(title);

    // Contenedor de filas
    const row = document.createElement("div");
    row.className = "row g-3";

    for (let i = 0; i < roomCount; i++) {
        const col = document.createElement("div");
        col.className = "col-md-6"; // Dos por fila en md+

        const label = document.createElement("label");
        label.setAttribute("for", `bedsPerRoom[${i}]`);
        label.textContent = `Camas en habitación ${i + 1}`;
        label.className = "form-label";

        const input = document.createElement("input");
        input.type = "number";
        input.name = `bedsPerRoom[${i}]`;
        input.min = "0";
        input.value = "1";
        input.required = true;
        input.className = "form-control";

        // Agregar al column
        col.appendChild(label);
        col.appendChild(input);

        // Agregar columna a la fila
        row.appendChild(col);
    }

    // Agregar fila al contenedor
    bedsContainer.appendChild(row);
}
            roomsInput.addEventListener("input", generateBedInputs);
        });

        // ********** Función para añadir normas **********
let ruleCount = 0;

function addRuleField() {
    const container = document.getElementById("rulesContainer");

    // Crear div agrupador
    const group = document.createElement("div");
    group.className = "mb-2";

    // Label
    const label = document.createElement("label");
    label.setAttribute("for", `rules[${ruleCount}]`);
    label.textContent = `Regla #${ruleCount + 1}:`;
    label.className = "form-label";

    // Input
    const input = document.createElement("input");
    input.type = "text";
    input.name = `rules[]`;
    input.placeholder = "Ej: No fumar, No mascotas";
    input.className = "form-control";

    // Agregar elementos al grupo
    group.appendChild(label);
    group.appendChild(input);

    // Agregar grupo al contenedor
    container.appendChild(group);

    ruleCount++;
} 