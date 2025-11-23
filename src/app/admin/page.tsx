'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { Plus, Trash2, Save, Search, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [status, setStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isDevMode, setIsDevMode] = useState(false);

    useEffect(() => {
        // Check if we're in development mode
        setIsDevMode(process.env.NODE_ENV === 'development');
    }, []);

    const handleLogin = async () => {
        if (password) {
            setIsAuthenticated(true);
            fetchData();
        }
    };

    const fetchData = async () => {
        setStatus('Loading...');
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
            setStatus('');
        } catch (e) {
            setStatus('Failed to load data');
        }
    };

    const handleSave = async () => {
        setStatus('Saving...');
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: password,
                    data: projects
                })
            });

            if (res.ok) {
                setStatus('Saved successfully!');
                setTimeout(() => setStatus(''), 3000);
            } else {
                const err = await res.json();
                setStatus(`Error: ${err.error}`);
            }
        } catch (e) {
            setStatus('Failed to save');
        }
    };

    const updateProject = (id: string, field: keyof Project, value: any) => {
        setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const addProject = () => {
        const newId = `p${projects.length}`;
        const newProject: Project = {
            id: newId,
            title: 'New Project',
            year: new Date().getFullYear().toString(),
            category: 'Category',
            thumbnail: '',
            images: [],
            description: 'Project description...'
        };
        setProjects([...projects, newProject]);
        setExpandedId(newId);
    };

    const deleteProject = (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isDevMode) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md shadow-2xl">
                    <h1 className="text-2xl font-bold mb-4 text-center">Admin Page Unavailable</h1>
                    <p className="text-gray-400 text-center">
                        This page is only available in development mode.
                        <br /><br />
                        Run <code className="bg-black px-2 py-1 rounded">npm run dev</code> locally to access the admin panel.
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md shadow-2xl">
                    <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-white transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl py-4 mb-8 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold">Project Manager (Dev Mode)</h1>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-600"
                            />
                        </div>

                        <button
                            onClick={addProject}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors"
                            title="Add New Project"
                        >
                            <Plus size={20} />
                        </button>

                        <button
                            onClick={handleSave}
                            className="bg-white text-black font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <Save size={18} /> Save
                        </button>
                    </div>
                </div>

                {/* Status Message */}
                {status && (
                    <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg shadow-lg z-50 ${status.includes('Error') ? 'bg-red-500' : 'bg-green-500'} text-white font-medium animate-fade-in`}>
                        {status}
                    </div>
                )}

                {/* Project List */}
                <div className="space-y-4">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300">
                            {/* Card Header */}
                            <div
                                onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-zinc-800 rounded-md overflow-hidden relative flex-shrink-0">
                                        {project.thumbnail ? (
                                            <img src={`/${project.thumbnail}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-600"><ImageIcon size={16} /></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{project.title}</h3>
                                        <p className="text-xs text-zinc-500 font-mono">{project.id} • {project.year}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {expandedId === project.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {/* Expanded Editor */}
                            {expandedId === project.id && (
                                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 space-y-6 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Title</label>
                                            <input
                                                type="text"
                                                value={project.title}
                                                onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                                                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-white transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Year</label>
                                            <input
                                                type="text"
                                                value={project.year}
                                                onChange={(e) => updateProject(project.id, 'year', e.target.value)}
                                                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-white transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Category</label>
                                            <input
                                                type="text"
                                                value={project.category}
                                                onChange={(e) => updateProject(project.id, 'category', e.target.value)}
                                                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-white transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Thumbnail Path</label>
                                            <input
                                                type="text"
                                                value={project.thumbnail}
                                                onChange={(e) => updateProject(project.id, 'thumbnail', e.target.value)}
                                                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-white transition-colors font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Description</label>
                                        <textarea
                                            value={project.description}
                                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                                            rows={8}
                                            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors leading-relaxed"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-zinc-800">
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="text-red-500 hover:text-red-400 flex items-center gap-2 text-sm font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} /> Delete Project
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
