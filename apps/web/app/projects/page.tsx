"use client";

import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

import toast from "react-hot-toast";

import { useEffect, useState }
    from "react";

import api from "../../lib/api";

export default function ProjectsPage() {

    const [projects,
        setProjects] =
        useState<any[]>([]);
    const [loading,
        setLoading] =
        useState(true);

    const [name,
        setName] =
        useState("");

    const [saving,
        setSaving] =
        useState(false);

    const [description,
        setDescription] =
        useState("");

    const [budget,
        setBudget] =
        useState("");

    const [editingProjectId,
        setEditingProjectId] =
        useState("");

    const [taskTitle,
        setTaskTitle] =
        useState("");

    const [taskDescription,
        setTaskDescription] =
        useState("");

    const [selectedProject,
        setSelectedProject] =
        useState("");

    const [editingTask,
        setEditingTask] =
        useState<any>(null);

    const [showTaskModal,
        setShowTaskModal] =
        useState(false);

    // FETCH
    const fetchProjects =
        async () => {

            try {

                setLoading(true);

                const res =
                    await api.get(
                        "/projects"
                    );

                setProjects(
                    Array.isArray(res.data)
                        ? res.data
                        : res.data.data || []
                );

            } catch (err) {

                console.log(err);

                toast.error(
                    "Failed to fetch projects"
                );

            } finally {

                setLoading(false);

            }
        };



    useEffect(() => {

        fetchProjects();

    }, []);

    // CREATE PROJECT
    const createProject =
        async () => {

            try {
                setSaving(true);

                if (
                    !name.trim() ||
                    !description.trim() ||
                    !budget
                ) {
                    toast.error(
                        "All fields are required"
                    );
                    return;
                }
                setSaving(true);
                await api.post(
                    "/projects",
                    {
                        name,
                        description,
                        budget:
                            Number(budget),
                    }
                );

                setName("");
                setDescription("");
                setBudget("");

                await fetchProjects();

                toast.success(
                    "Project Created Successfully"
                );

            } catch (err) {

                console.log(err);
                toast.error(
                    "Something went wrong"
                );
            } finally {
                setSaving(false);
            }
        };

    // UPDATE PROJECT
    const updateProject =
        async () => {

            try {
                setSaving(true);

                await api.put(

                    `/projects/${editingProjectId}`,

                    {
                        name,
                        description,
                        budget:
                            Number(budget),
                    }
                );

                setEditingProjectId("");

                setName("");

                setDescription("");

                setBudget("");

                await fetchProjects();

                toast.success(
                    "Project Updated Successfully"
                );

            } catch (err) {

                console.log(err);
                toast.error(
                    "Something went wrong"
                );
            } finally {
                setSaving(false);
            }
        };

    // DELETE PROJECT
    const deleteProject =
        async (id: string) => {

            try {

                await api.delete(
                    `/projects/${id}`
                );

                await fetchProjects();

                toast.success(
                    "Project Deleted Successfully"
                );

            } catch (err) {

                console.log(err);
                toast.error(
                    "Something went wrong"
                );
            }
        };

    // DELETE TASK
    const deleteTask =
        async (id: string) => {

            try {

                await api.delete(
                    `/projects/task/${id}`
                );

                await fetchProjects();

            } catch (err) {

                console.log(err);
                toast.error(
                    "Something went wrong"
                );
            }
        };


    const updateTask =
        async () => {

            if (!editingTask) {
                return;
            }

            try {

                await api.put(

                    `/projects/task/${editingTask.id}`,

                    {
                        title:
                            editingTask.title,

                        description:
                            editingTask.description,

                        status:
                            editingTask.status,
                    }
                );

                toast.success(
                    "Task Updated"
                );

                setShowTaskModal(false);

                setEditingTask(null);

                await fetchProjects();

            } catch (err) {

                console.log(err);

                toast.error(
                    "Update failed"
                );
            }
        };


    // CREATE TASK
    const createTask =
        async () => {

            try {

                if (
                    !selectedProject ||
                    !taskTitle.trim()
                ) {
                    toast.error(
                        "Project and Task Title required"
                    );
                    return;
                }

                await api.post(
                    "/projects/task",
                    {
                        title:
                            taskTitle,

                        description:
                            taskDescription,

                        projectId:
                            selectedProject,
                    }
                );

                setTaskTitle("");
                setTaskDescription("");

                await fetchProjects();

                toast.success(
                    "Task Created Successfully"
                );

            } catch (err) {

                console.log(err);

                toast.error(
                    "Something went wrong"
                );
            }
        };

    // UPDATE TASK
    const updateTaskStatus =
        async (
            id: string,
            status: string
        ) => {

            try {

                await api.put(
                    `/projects/task/${id}`,
                    {
                        status,
                    }
                );

                await fetchProjects();

            } catch (err) {

                console.log(err);
                toast.error(
                    "Something went wrong"
                );
            }
        };

    return (

        <AuthGuard>

            <div className="flex">

                <Sidebar />

                <div className="p-10 w-full ml-[290px] bg-gray-100 min-h-screen text-black">

                    {/* HEADER */}
                    <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

                        {/* PREMIUM OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-emerald-50/30 pointer-events-none"></div>

                        {/* GLOW EFFECTS */}
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>

                        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>

                        {/* TOP BORDER */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

                        {/* CONTENT */}
                        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                            {/* LEFT */}
                            <div className="flex-1 max-w-3xl">

                                {/* TITLE */}
                                <div className="flex items-start gap-4">

                                    {/* ICON */}
                                    <div className="relative">

                                        <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full"></div>

                                        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 text-white p-4 rounded-[28px] shadow-[0_15px_35px_rgba(16,185,129,0.35)] border border-white/20">

                                            📁

                                        </div>

                                    </div>

                                    {/* TEXT */}
                                    <div>

                                        <p className="text-sm uppercase tracking-[0.30em] text-emerald-600 font-bold">

                                            Enterprise ERP

                                        </p>

                                        <h1 className="text-4xl sm:text-5xl xl:text-[56px] font-black text-[#0f172a] tracking-tight leading-[0.95] mt-2">

                                            Project
                                            <br />
                                            Management

                                        </h1>

                                        {/* TAGS */}
                                        <div className="flex flex-wrap items-center gap-3 mt-4">

                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                                                PROJECT TRACKING

                                            </div>

                                            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide">

                                                TASK WORKFLOW

                                            </div>

                                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide hidden sm:flex">

                                                ENTERPRISE DELIVERY

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* DESCRIPTION */}
                                <p className="text-gray-600 text-[17px] leading-relaxed max-w-2xl mt-6">

                                    Manage enterprise projects, team collaboration,
                                    task execution and operational workflows through
                                    a centralized project management system.

                                </p>

                                {/* STATUS */}
                                <div className="flex flex-wrap items-center gap-3 mt-6">

                                    {/* ACTIVE */}
                                    <div className="flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl text-emerald-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-emerald-200 shadow-sm">

                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>

                                        Projects Active

                                    </div>

                                    {/* TASKS */}
                                    <div className="bg-cyan-100/80 backdrop-blur-xl text-cyan-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-cyan-200 shadow-sm">

                                        Task Workflow Enabled

                                    </div>

                                    {/* COLLAB */}
                                    <div className="bg-blue-100/80 backdrop-blur-xl text-blue-700 px-4 py-2.5 rounded-2xl text-sm font-semibold border border-blue-200 shadow-sm">

                                        Team Collaboration Active

                                    </div>

                                </div>

                            </div>

                            {/* RIGHT */}
                            <div className="hidden xl:flex items-center justify-center">

                                <div className="relative">

                                    <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full"></div>

                                    <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-white/30 backdrop-blur-2xl flex items-center justify-center">

                                        <div className="text-[80px]">

                                            📁

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                    {/* ANALYTICS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-3xl p-6 shadow-lg">

                            <p className="text-white/80">
                                Total Projects
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {projects.length}
                            </h2>

                        </div>

                        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-3xl p-6 shadow-lg">

                            <p className="text-white/80">
                                Total Tasks
                            </p>

                            <h2 className="text-4xl font-bold mt-3">

                                {
                                    (Array.isArray(projects)
                                        ? projects
                                        : []).reduce(
                                            (acc: number, p: any) => acc + (Array.isArray(p.tasks) ? p.tasks.length : 0),
                                            0
                                        )
                                }

                            </h2>

                        </div>

                        <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-3xl p-6 shadow-lg">

                            <p className="text-white/80">
                                Active Projects
                            </p>

                            <h2 className="text-4xl font-bold mt-3">

                                {
                                    projects.filter(
                                        (p: any) =>
                                            p.status ===
                                            "ACTIVE"
                                    ).length
                                }

                            </h2>

                        </div>

                        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-3xl p-6 shadow-lg">

                            <p className="text-white/80">
                                Completed Tasks
                            </p>

                            <h2 className="text-4xl font-bold mt-3">

                                {
                                    (Array.isArray(projects)
                                        ? projects
                                        : []
                                    ).reduce(
                                        (acc: number, p: any) =>

                                            acc +

                                            (p.tasks || [])
                                                .filter(
                                                    (t: any) =>
                                                        t.status ===
                                                        "COMPLETED"
                                                ).length,

                                        0
                                    )
                                }

                            </h2>

                        </div>

                    </div>

                    {/* FORMS */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">

                        {/* CREATE PROJECT */}
                        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">

                            <h2 className="text-2xl font-bold mb-5">
                                Create Project
                            </h2>

                            <input
                                placeholder="Project Name"
                                className="w-full border p-3 rounded-xl mb-4"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                            />

                            <textarea
                                placeholder="Description"
                                className="w-full border p-3 rounded-xl mb-4"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Budget"
                                className="w-full border p-3 rounded-xl mb-5"
                                value={budget}
                                onChange={(e) =>
                                    setBudget(
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                onClick={() => {

                                    const confirmed =
                                        window.confirm(

                                            editingProjectId
                                                ? "Update project?"
                                                : "Create project?"

                                        );

                                    if (!confirmed) {
                                        return;
                                    }

                                    editingProjectId
                                        ? updateProject()
                                        : createProject();

                                }}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
                            >
                                {
                                    saving
                                        ? "Saving..."
                                        : editingProjectId
                                            ? "Update Project"
                                            : "Create Project"

                                }
                            </button>
                            {
                                editingProjectId && (

                                    <button
                                        onClick={() => {

                                            setEditingProjectId("");

                                            setName("");

                                            setDescription("");

                                            setBudget("");

                                        }}
                                        className="w-full mt-3 bg-gray-300 text-black py-3 rounded-xl"
                                    >

                                        Cancel Edit

                                    </button>

                                )
                            }

                        </div>

                        {/* CREATE TASK */}
                        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">

                            <h2 className="text-2xl font-bold mb-5">
                                Create Task
                            </h2>

                            <select
                                className="w-full border p-3 rounded-xl mb-4"
                                value={selectedProject}
                                onChange={(e) =>
                                    setSelectedProject(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Project
                                </option>

                                {projects.map(
                                    (p: any) => (

                                        <option
                                            key={p.id}
                                            value={p.id}
                                        >
                                            {p.name}
                                        </option>

                                    ))}

                            </select>

                            <input
                                placeholder="Task Title"
                                className="w-full border p-3 rounded-xl mb-4"
                                value={taskTitle}
                                onChange={(e) =>
                                    setTaskTitle(
                                        e.target.value
                                    )
                                }
                            />

                            <textarea
                                placeholder="Task Description"
                                className="w-full border p-3 rounded-xl mb-5"
                                value={taskDescription}
                                onChange={(e) =>
                                    setTaskDescription(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                onClick={() => {

                                    const confirmed =
                                        window.confirm(
                                            "Create task?"
                                        );

                                    if (!confirmed) {
                                        return;
                                    }

                                    createTask();

                                }}
                                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
                            >
                                Create Task
                            </button>

                        </div>

                    </div>

                    {/* PROJECTS */}
                    <div className="space-y-8">

                        {loading ? (

                            <div className="animate-pulse space-y-4">

                                <div className="h-40 bg-gray-200 rounded-3xl"></div>

                                <div className="h-40 bg-gray-200 rounded-3xl"></div>

                            </div>

                        ) : projects.length === 0 ? (

                            <div className="bg-white rounded-3xl p-12 text-center">

                                <div className="text-5xl mb-4">
                                    📁
                                </div>

                                <h3 className="text-2xl font-bold text-gray-700">

                                    No Projects Found

                                </h3>

                                <p className="text-gray-500 mt-2">

                                    Create your first project to start managing tasks.

                                </p>

                            </div>

                        ) : (

                            projects.map(
                                (project: any) => (

                                    <div
                                        key={project.id}
                                        className="bg-white rounded-3xl shadow-md border border-gray-200 p-6"
                                    >

                                        {/* PROJECT HEADER */}
                                        <div className="flex items-center justify-between mb-6">

                                            <div>

                                                <h2 className="text-2xl font-bold">
                                                    {project.name}
                                                </h2>

                                                <p className="text-gray-500 mt-1">
                                                    {project.description}
                                                </p>

                                            </div>

                                            <div className="text-right">

                                                <p className="text-sm text-gray-500">
                                                    Budget
                                                </p>

                                                <h3 className="text-2xl font-bold text-green-600">
                                                    ₹{
                                                        Number(
                                                            project.budget
                                                        ).toLocaleString()
                                                    }
                                                </h3>

                                            </div>

                                        </div>

                                        <div className="flex gap-3 mb-6">

                                            <button
                                                onClick={() => {

                                                    setEditingProjectId(
                                                        project.id
                                                    );

                                                    setName(
                                                        project.name
                                                    );

                                                    setDescription(
                                                        project.description
                                                    );

                                                    setBudget(
                                                        project.budget.toString()
                                                    );
                                                }}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                                            >
                                                Edit Project
                                            </button>

                                            <button
                                                onClick={() => {

                                                    const confirmed =
                                                        window.confirm(
                                                            `Delete ${project.name}?`
                                                        );

                                                    if (!confirmed) {
                                                        return;
                                                    }

                                                    deleteProject(project.id);

                                                }}
                                                className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                                            >
                                                Delete Project
                                            </button>

                                        </div>

                                        {/* TASKS */}
                                        <div className="space-y-4">

                                            {!project.tasks || project.tasks.length === 0 ? (

                                                <p className="text-gray-500">
                                                    No tasks available
                                                </p>

                                            ) : (

                                                (project.tasks || []).map(
                                                    (task: any) => (

                                                        <div
                                                            key={task.id}
                                                            className="border rounded-2xl p-5 flex items-center justify-between"
                                                        >

                                                            <div>

                                                                <div className="flex items-center gap-3">

                                                                    <h3 className="font-bold text-lg">
                                                                        {task.title}
                                                                    </h3>
                                                                    <span
                                                                        className={` px-3 py-1 rounded-full text-xs font-bold ${task.status === "COMPLETED"
                                                                            ? "bg-green-100 text-green-700"
                                                                            : task.status === "IN_PROGRESS"
                                                                                ? "bg-blue-100 text-blue-700"
                                                                                : "bg-yellow-100 text-yellow-700"
                                                                            }

                                                                        `}
                                                                    >

                                                                        {task.status}

                                                                    </span>

                                                                </div>

                                                                <p className="text-gray-500 mt-1">
                                                                    {task.description}
                                                                </p>

                                                            </div>

                                                            <div className="flex items-center gap-3">

                                                                <select
                                                                    value={task.status}
                                                                    onChange={(e) =>
                                                                        updateTaskStatus(
                                                                            task.id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="border p-2 rounded-xl"
                                                                >

                                                                    <option>
                                                                        PENDING
                                                                    </option>

                                                                    <option>
                                                                        IN_PROGRESS
                                                                    </option>

                                                                    <option>
                                                                        COMPLETED
                                                                    </option>

                                                                </select>

                                                                <button
                                                                    onClick={() => {

                                                                        setEditingTask(
                                                                            { ...task }
                                                                        );

                                                                        setShowTaskModal(true);
                                                                    }}
                                                                    className="bg-blue-600 text-white px-3 py-2 rounded-xl text-sm"
                                                                >

                                                                    Edit

                                                                </button>

                                                                <button
                                                                    onClick={() => {

                                                                        const confirmed =
                                                                            window.confirm(
                                                                                `Delete task "${task.title}"?`
                                                                            );

                                                                        if (!confirmed) {
                                                                            return;
                                                                        }

                                                                        deleteTask(task.id);

                                                                    }}
                                                                    className="bg-red-600 text-white px-3 py-2 rounded-xl text-sm"
                                                                >
                                                                    Delete
                                                                </button>

                                                            </div>

                                                        </div>

                                                    ))
                                            )}

                                        </div>

                                    </div>

                                ))

                        )}

                    </div>

                </div>

            </div>


            {showTaskModal && editingTask && (

                <div className=" fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">

                    <div className=" bg-white text-black w-full max-w-xl rounded-3xl p-8">

                        <h2 className="  text-2xl font-bold  mb-5">

                            Edit Task

                        </h2>

                        <input
                            value={editingTask.title}
                            onChange={(e) =>

                                setEditingTask({

                                    ...editingTask,

                                    title: e.target.value

                                })
                            }
                            className="w-full border p-3 rounded-xl mb-4"
                        />

                        <textarea
                            value={editingTask.description || ""}
                            onChange={(e) =>

                                setEditingTask({

                                    ...editingTask,

                                    description: e.target.value

                                })
                            }
                            className="w-full border p-3 rounded-xl mb-4"
                        />

                        <select
                            value={editingTask.status}
                            onChange={(e) =>

                                setEditingTask({

                                    ...editingTask,

                                    status: e.target.value

                                })
                            }
                            className="w-full border p-3 rounded-xl mb-5">

                            <option>
                                PENDING
                            </option>

                            <option>
                                IN_PROGRESS
                            </option>

                            <option>
                                COMPLETED
                            </option>

                        </select>

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => {

                                    setShowTaskModal(false);

                                    setEditingTask(null);

                                }}

                                className="px-5 py-3 rounded-xl bg-gray-200">

                                Cancel

                            </button>

                            <button
                                onClick={() => {

                                    const confirmed =
                                        window.confirm(
                                            "Save task changes?"
                                        );

                                    if (!confirmed) {
                                        return;
                                    }

                                    updateTask();

                                }}
                                className="px-5 py-3 rounded-xl bg-blue-600 text-white">

                                Save

                            </button>

                        </div>

                    </div>

                </div>

            )}


        </AuthGuard>
    );
}