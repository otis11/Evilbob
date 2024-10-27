import { iconCog, iconFromString, iconReload } from "../../icons";
import { t } from "../../locales/locales";
import { browserName, browserVersion } from "../../platform";
import { PLUGINS_BROWSER_FILTERED, getEnabledPlugins } from "../../plugins";
import { resultsCounter } from "./dom";
import { loadFreshData } from "./search-data";

export async function renderFooter() {
	const footer = document.getElementById("footer");

	const browser = document.createElement("span");
	browser.innerText = `${browserName} ${browserVersion}`;

	const bobVersion = document.createElement("span");
	bobVersion.innerText = `Bob ${chrome.runtime.getManifest().version}`;

	const reload = iconFromString(iconReload, "16px");
	reload.addEventListener("click", async () => {
		await loadFreshData();
	});

	const settings = iconFromString(iconCog, "16px");
	settings.addEventListener("click", () => {
		chrome.runtime.openOptionsPage();
	});

	const spacer = document.createElement("span");
	spacer.classList.add("spacer");

	const total = PLUGINS_BROWSER_FILTERED.length;
	const enabled = (await getEnabledPlugins()).length;
	const enabledGroups = document.createElement("span");
	enabledGroups.innerText = `${enabled}/${total} ${t("Result groups enabled")}`;

	footer?.append(
		resultsCounter,
		enabledGroups,
		spacer,
		browser,
		bobVersion,
		reload,
		settings,
	);
}
