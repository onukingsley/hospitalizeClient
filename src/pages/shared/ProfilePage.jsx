import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/lib/constants';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleSave = () => {
    toast.success('Profile updated');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="My Profile" subtitle="View and edit your profile information" />

      <Card className="p-6">
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-bold">{user.name}</h3>
            <p className="text-muted-foreground">{ROLE_LABELS[user.role]}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2"><User className="w-4 h-4" />Full Name</Label>
            <Input defaultValue={user.name} className="mt-1" />
          </div>
          <div>
            <Label className="flex items-center gap-2"><Mail className="w-4 h-4" />Email</Label>
            <Input defaultValue={user.email} className="mt-1" />
          </div>
          <div>
            <Label className="flex items-center gap-2"><Phone className="w-4 h-4" />Phone</Label>
            <Input placeholder="+234..." className="mt-1" />
          </div>
          <div>
            <Label className="flex items-center gap-2"><Shield className="w-4 h-4" />Role</Label>
            <Input value={ROLE_LABELS[user.role]} disabled className="mt-1 bg-muted" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
