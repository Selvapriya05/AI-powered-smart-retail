import React, { useState } from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import { User, Lock, MapPin, Plus, Trash2, Eye, EyeOff, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const tabs = [
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
  { id: 'password', label: 'Password', icon: <Lock size={16} /> },
  { id: 'address', label: 'Addresses', icon: <MapPin size={16} /> },
];

export default function Profile() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', email: user?.email || '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', line1: '12, MG Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', default: true },
  ]);
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', line1: '', city: '', state: '', pincode: '' });

  const saveProfile = () => {
    if (!profile.fullName || !profile.email) { toast.error('Name and email required'); return; }
    toast.success('Profile updated successfully!');
  };

  const changePassword = () => {
    if (!passwords.current) { toast.error('Enter current password'); return; }
    if (passwords.newPass.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    toast.success('Password changed successfully!');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const addAddress = () => {
    if (!newAddr.line1 || !newAddr.city || !newAddr.pincode) { toast.error('Fill all address fields'); return; }
    setAddresses([...addresses, { ...newAddr, id: Date.now(), default: false }]);
    setNewAddr({ label: 'Home', line1: '', city: '', state: '', pincode: '' });
    setShowAddAddr(false);
    toast.success('Address added!');
  };

  const deleteAddress = (id) => { setAddresses(addresses.filter(a => a.id !== id)); toast.success('Address removed'); };
  const setDefault = (id) => { setAddresses(addresses.map(a => ({ ...a, default: a.id === id }))); toast.success('Default address updated'); };

  return (
    <CustomerLayout title="My Profile">
      <div className="profile-layout">
        {/* Sidebar Tabs */}
        <div className="profile-tabs">
          <div className="profile-avatar-big">{user?.fullName?.charAt(0)}</div>
          <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{user?.fullName}</p>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>{user?.email}</p>
          {tabs.map(t => (
            <button key={t.id} className={`profile-tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="profile-content">
          {tab === 'profile' && (
            <div className="table-card">
              <h3 className="chart-title">Update Profile</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-input" value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-input" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="9876543210" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <button className="btn-save" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: 6 }} onClick={saveProfile}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}

          {tab === 'password' && (
            <div className="table-card">
              <h3 className="chart-title">Change Password</h3>
              {[
                { key: 'current', label: 'Current Password', show: showPwd.current, toggle: () => setShowPwd({ ...showPwd, current: !showPwd.current }) },
                { key: 'newPass', label: 'New Password', show: showPwd.new, toggle: () => setShowPwd({ ...showPwd, new: !showPwd.new }) },
                { key: 'confirm', label: 'Confirm New Password', show: showPwd.confirm, toggle: () => setShowPwd({ ...showPwd, confirm: !showPwd.confirm }) },
              ].map(f => (
                <div className="form-group" key={f.key} style={{ marginBottom: '1rem' }}>
                  <label>{f.label}</label>
                  <div className="input-wrapper">
                    <input className="form-input" type={f.show ? 'text' : 'password'}
                      value={passwords[f.key]} onChange={e => setPasswords({ ...passwords, [f.key]: e.target.value })} />
                    <button type="button" className="eye-btn" onClick={f.toggle}>
                      {f.show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={changePassword}>
                <Lock size={16} /> Change Password
              </button>
            </div>
          )}

          {tab === 'address' && (
            <div className="table-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 className="chart-title" style={{ margin: 0 }}>Saved Addresses</h3>
                <button className="btn-add" onClick={() => setShowAddAddr(!showAddAddr)}><Plus size={16} /> Add Address</button>
              </div>

              {showAddAddr && (
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1.25rem', marginBottom: '1.25rem', border: '1.5px solid #e2e8f0' }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Label</label>
                      <select className="form-input" value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })}>
                        <option>Home</option><option>Work</option><option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input className="form-input" placeholder="600001" value={newAddr.pincode} onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Address Line</label>
                    <input className="form-input" placeholder="House no, Street, Area" value={newAddr.line1} onChange={e => setNewAddr({ ...newAddr, line1: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input className="form-input" placeholder="Chennai" value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input className="form-input" placeholder="Tamil Nadu" value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })} />
                    </div>
                  </div>
                  <button className="btn-save" onClick={addAddress}>Save Address</button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {addresses.map(addr => (
                  <div key={addr.id} className="address-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className="cat-badge">{addr.label}</span>
                          {addr.default && <span className="status-badge badge-green">Default</span>}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#1e293b' }}>{addr.line1}</p>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                      <div className="action-btns">
                        {!addr.default && <button className="icon-btn green" onClick={() => setDefault(addr.id)} title="Set Default"><MapPin size={14} /></button>}
                        <button className="icon-btn red" onClick={() => deleteAddress(addr.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
