import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  return (
    <Card className="group hover:border-primary/20 transition-all hover:shadow-sm">
      <CardHeader className="p-4">
        <div className="text-primary border-primary/20 bg-primary/10 group-hover:bg-primary/20 mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md border p-2">
          <Icon size={20} />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground p-4 pt-0">
        {description}
      </CardContent>
    </Card>
  );
};
