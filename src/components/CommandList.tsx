import type { PluginCommandExtended } from "@/plugins";
import { VList, VListItem, VListItemIcon } from "./VList.tsx";
export interface CommandListProps {
	commands: PluginCommandExtended[];
	// biome-ignore lint/suspicious/noExplicitAny: Can be any but can probably be improved via generic types?
	onSelect: (item: any) => void;
}
export function CommandList({ commands, onSelect }: CommandListProps) {
	return (
		<VList onSelect={onSelect}>
			{commands.map((command) => (
				<VListItem data={command} key={command.name}>
					<VListItemIcon>{command.plugin.icon}</VListItemIcon>
					<span>{command.title}</span>
					<span className="text-muted-foreground text-sm pl-4">
						{command.plugin?.title}
					</span>
					{command.type === "command" ? (
						<span className="ml-auto text-muted-foreground text-sm">
							Command
						</span>
					) : (
						<span className="ml-auto text-muted-foreground text-sm">
							View
						</span>
					)}
				</VListItem>
			))}
		</VList>
	);
}
