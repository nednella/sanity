import { cn } from "@/lib/ui/utils.js";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn("table", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader(props: React.ComponentProps<"thead">) {
  return <thead {...props} />;
}

export function TableBody(props: React.ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("hover:bg-base-200", className)}
      {...props}
    />
  );
}

export function TableHead(props: React.ComponentProps<"th">) {
  return <th {...props} />;
}

export function TableCell(props: React.ComponentProps<"td">) {
  return <td {...props} />;
}

export function TableCaption(props: React.ComponentProps<"caption">) {
  return <caption {...props} />;
}
