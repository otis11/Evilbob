import { NumberSelect } from "@/components/NumberSelect.tsx";
import { toast } from "@/components/Toast";
import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { getFaviconUrl } from "@/lib/utils.ts";
import { useEffect, useState } from "react";

export function Command() {
	const [search, useSearch] = useMemoryStore("search");
	const [history, setHistory] = useState<
		chrome.history.HistoryItem[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("loading...");
	const [maxResults, setMaxResults] = useState<number>(100);

	useEffect(() => {
		let isMounted = true;
		browserApi.history.search({ text: search, maxResults }).then((res) => {
			if (!isMounted) {
				return;
			}
			if (!Array.isArray(res)) {
				setLoadingMessage("Failed loading history..");
				return;
			}
			setLoadingMessage("");
			setHistory(res);
		});
		return () => {
			isMounted = false;
		};
	}, [search, maxResults]);

	async function onSelect(site: chrome.topSites.MostVisitedURL) {
		await browserApi.tabs.create({ url: site.url });
	}

	return (
		<>
			<div className="flex py-4">
				<div className="mr-auto"></div>
				<NumberSelect
					value={maxResults}
					values={[50, 100, 250, 500]}
					onValueChange={setMaxResults}
				></NumberSelect>
			</div>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{loadingMessage}
				</div>
			) : (
				<VList onSelect={onSelect} itemHeight={70}>
					{(history || []).map((item) => (
						<VListItem
							className="flex-col"
							data={item}
							key={item.url}
							actions={<Actions {...item}></Actions>}
						>
							<p className="flex items-center w-full">
								<VListItemIcon
									url={getFaviconUrl(item.url)}
								></VListItemIcon>
								<span>{item.title}</span>
							</p>
							<p className="flex items-center w-full pt-1">
								<span className="text-muted-foreground pl-8 truncate shrink-0">
									{item.visitCount} Visits
								</span>
								<span className="text-muted-foreground pl-4 truncate">
									{item.url}
								</span>
							</p>
						</VListItem>
					))}
				</VList>
			)}
		</>
	);
}

function Actions(item: chrome.history.HistoryItem) {
	async function deleteUrl() {
		if (!item.url) {
			toast(<span>Item has no url.</span>);
			return;
		}

		await browserApi.history.deleteUrl({ url: item.url });
		toast(<span>Url deleted.</span>);
	}

	return (
		<VList>
			<VListItem onClick={deleteUrl}>
				Delete Url (Removes all occurrences)
			</VListItem>
		</VList>
	);
}
