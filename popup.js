document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  const geminiModelSelect = document.getElementById("geminiModel");
  const saveKeyButton = document.getElementById("saveKey");
  const processPageButton = document.getElementById("processPage");
  const statusDiv = document.getElementById("status");
  const showAnswersToggle = document.getElementById("showAnswersToggle");
  const autoSelectToggle = document.getElementById("autoSelectToggle");
  const processOnSwitchToggle = document.getElementById("processOnSwitchToggle");
  const autoAdvanceToggle = document.getElementById("autoAdvanceToggle");

  chrome.storage.sync.get(
    [
      "geminiApiKey",
      "geminiModel",
      "showAnswers",
      "autoSelectAnswers",
      "processOnSwitch",
      "autoAdvance",
    ],
    (result) => {
      const defaultKey = "";
      if (result.geminiApiKey) {
        apiKeyInput.value = result.geminiApiKey;
      } else {
        apiKeyInput.value = defaultKey;
        // no default key
      }

      if (result.geminiModel) {
        if (![...geminiModelSelect.options].some((o) => o.value === result.geminiModel)) {
          const opt = document.createElement("option");
          opt.value = result.geminiModel;
          opt.textContent = result.geminiModel + " (custom)";
          geminiModelSelect.appendChild(opt);
        }
        geminiModelSelect.value = result.geminiModel;
      }

      showAnswersToggle.checked = typeof result.showAnswers === "boolean" ? result.showAnswers : true;
      autoSelectToggle.checked = typeof result.autoSelectAnswers === "boolean" ? result.autoSelectAnswers : true;
      processOnSwitchToggle.checked = typeof result.processOnSwitch === "boolean" ? result.processOnSwitch : true;
      autoAdvanceToggle.checked = typeof result.autoAdvance === "boolean" ? result.autoAdvance : false;

      statusDiv.textContent = result.geminiApiKey ? "Ajustes cargados." : "Clave API configurada.";
      setTimeout(() => {
        if (statusDiv.textContent.includes("cargados") || statusDiv.textContent.includes("configurada")) {
          statusDiv.textContent = "";
        }
      }, 2000);
    },
  );

  showAnswersToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ showAnswers: showAnswersToggle.checked });
  });

  autoSelectToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ autoSelectAnswers: autoSelectToggle.checked });
  });

  processOnSwitchToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ processOnSwitch: processOnSwitchToggle.checked });
  });

  autoAdvanceToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ autoAdvance: autoAdvanceToggle.checked });
  });

  saveKeyButton.addEventListener("click", () => {
    const apiKey = apiKeyInput.value.trim();
    const model = geminiModelSelect.value;
    if (!apiKey) {
      statusDiv.textContent = "Por favor ingresa la API Key.";
      return;
    }
    chrome.storage.sync.set({ geminiApiKey: apiKey, geminiModel: model }, () => {
      statusDiv.textContent = "¡Ajustes guardados correctamente!";
      setTimeout(() => (statusDiv.textContent = ""), 2000);
    });
  });

  processPageButton.addEventListener("click", () => {
    statusDiv.textContent = "Procesando preguntas en la página...";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(
          tabId,
          { action: "processPage", showAnswers: showAnswersToggle.checked },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Popup Error: Error sending message to content script: ",
                chrome.runtime.lastError.message,
              );
              statusDiv.textContent = `Error de comunicación. Recarga la página (F5).`;
            } else if (response) {
              if (response.success) {
                if (response.result === true) {
                  statusDiv.textContent = "Procesamiento iniciado.";
                } else if (response.result === false) {
                  statusDiv.textContent = "No se encontraron preguntas en esta página.";
                } else {
                  statusDiv.textContent = "Página procesada.";
                }
              } else {
                statusDiv.textContent = `Error: ${response.error || "Desconocido"}`;
              }
            } else {
              statusDiv.textContent = "Sin respuesta. Asegúrate de estar en NetAcad.";
            }
            setTimeout(() => {
              if (statusDiv.textContent !== "") statusDiv.textContent = "";
            }, 3500);
          },
        );
      } else {
        statusDiv.textContent = "Error: No se encontró la pestaña activa.";
      }
    });
  });
});
