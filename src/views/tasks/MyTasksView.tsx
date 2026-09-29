import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  Clock,
  User,
  AlertTriangle,
  Calendar,
  Layers,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  List,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ProfessionalTask, TaskStatus, TaskPriority } from '../../types';

export const MyTasksView: React.FC = () => {
  const { tasks, updateTaskStatus, createTask, currentClient, switchClient } = useApp();
  const { currentUser } = useAuth();

  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProfessionalTask | null>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('HIGH');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-10-25');
  const [newTaskType, setNewTaskType] = useState<ProfessionalTask['type']>('GST_FILING');

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
    return true;
  });

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask({
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      type: newTaskType
    });
    setIsNewTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const kanbanColumns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'DUE_TODAY', label: 'Due Today', color: 'var(--danger-500)' },
    { status: 'PENDING_REVIEW', label: 'Pending Review', color: 'var(--warning-500)' },
    { status: 'PENDING_APPROVAL', label: 'Pending Approval', color: 'var(--primary-500)' },
    { status: 'EXCEPTIONS', label: 'Exceptions / Triage', color: 'var(--danger-500)' },
    { status: 'UPCOMING', label: 'Upcoming', color: 'var(--info-500)' },
    { status: 'COMPLETED', label: 'Completed', color: 'var(--success-500)' }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={24} color="var(--primary-500)" /> Professional Workbench & Task SLA
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Manage statutory filing tasks, voucher approvals, and client document requests with SLA deadlines.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            <button
              onClick={() => setViewMode('KANBAN')}
              className="btn btn-sm"
              style={{
                background: viewMode === 'KANBAN' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'KANBAN' ? 'var(--primary-500)' : 'var(--text-muted)'
              }}
            >
              <LayoutGrid size={14} /> Kanban
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className="btn btn-sm"
              style={{
                background: viewMode === 'TABLE' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'TABLE' ? 'var(--primary-500)' : 'var(--text-muted)'
              }}
            >
              <List size={14} /> Table View
            </button>
          </div>

          <button onClick={() => setIsNewTaskModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Create Task
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Status:</span>
          {['ALL', 'DUE_TODAY', 'PENDING_REVIEW', 'PENDING_APPROVAL', 'EXCEPTIONS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={filterStatus === st ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ fontSize: '0.72rem', padding: '4px 10px' }}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input-field select-field"
            style={{ width: '130px', padding: '4px 8px', fontSize: '0.74rem' }}
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* View Mode: Kanban */}
      {viewMode === 'KANBAN' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            alignItems: 'flex-start'
          }}
        >
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className="glass-panel"
                style={{ padding: '14px', background: 'var(--bg-card)', minHeight: '380px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{col.label}</span>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.66rem' }}>{colTasks.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer'
                      }}
                      className="glass-panel-hover"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '0.6rem' }}>{task.type.replace(/_/g, ' ')}</span>
                        <span
                          className={task.priority === 'CRITICAL' ? 'badge badge-danger' : task.priority === 'HIGH' ? 'badge badge-warning' : 'badge badge-info'}
                          style={{ fontSize: '0.6rem' }}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {task.title}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {task.clientName}
                      </div>

                      {task.aiSuggestedAction && (
                        <div
                          style={{
                            marginTop: '8px',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            background: 'rgba(168, 85, 247, 0.1)',
                            border: '1px solid rgba(168, 85, 247, 0.25)',
                            fontSize: '0.68rem',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            gap: '4px'
                          }}
                        >
                          <Sparkles size={12} color="var(--ai-purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{task.aiSuggestedAction}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          <span style={{ color: task.slaHoursRemaining < 24 ? 'var(--danger-500)' : 'inherit', fontWeight: 600 }}>
                            {task.slaHoursRemaining}h SLA
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {task.commentsCount > 0 && <span>💬 {task.commentsCount}</span>}
                          {task.attachmentsCount > 0 && <span>📎 {task.attachmentsCount}</span>}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 8px', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode: Table */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Client</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Due Date & SLA</th>
                <th>Assigned Professional</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} onClick={() => setSelectedTask(task)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 700 }}>{task.title}</td>
                  <td>{task.clientName}</td>
                  <td><span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>{task.type}</span></td>
                  <td>
                    <span className={task.priority === 'CRITICAL' ? 'badge badge-danger' : task.priority === 'HIGH' ? 'badge badge-warning' : 'badge badge-info'} style={{ fontSize: '0.62rem' }}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <div>{task.dueDate}</div>
                    <div style={{ fontSize: '0.68rem', color: task.slaHoursRemaining < 24 ? 'var(--danger-500)' : 'var(--text-muted)', fontWeight: 600 }}>
                      {task.slaHoursRemaining}h remaining
                    </div>
                  </td>
                  <td>{task.assignedToName} ({task.assignedRole})</td>
                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.62rem' }}>
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTaskStatus(task.id, 'COMPLETED');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                    >
                      ✓ Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Detail Drawer */}
      {selectedTask && (
        <div className="modal-backdrop" onClick={() => setSelectedTask(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={18} color="var(--primary-500)" />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700 }}>Task Details</h3>
              </div>
              <button onClick={() => setSelectedTask(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <span className="badge badge-primary">{selectedTask.type}</span>
                  <span className={selectedTask.priority === 'CRITICAL' ? 'badge badge-danger' : 'badge badge-warning'}>{selectedTask.priority} Priority</span>
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedTask.title}</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                  {selectedTask.description}
                </p>
              </div>

              {selectedTask.aiSuggestedAction && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ai-purple)', fontWeight: 700 }}>
                    <Sparkles size={14} /> AI Recommendation & Citations:
                  </div>
                  <div style={{ marginTop: '4px', color: 'var(--text-primary)' }}>
                    {selectedTask.aiSuggestedAction}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Client Entity</div>
                  <div style={{ fontWeight: 700, marginTop: '2px' }}>{selectedTask.clientName}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Due Date & SLA</div>
                  <div style={{ fontWeight: 700, marginTop: '2px' }}>{selectedTask.dueDate} ({selectedTask.slaHoursRemaining}h remaining)</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Assigned Professional</div>
                  <div style={{ fontWeight: 700, marginTop: '2px' }}>{selectedTask.assignedToName} ({selectedTask.assignedRole})</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Current Status</div>
                  <div style={{ fontWeight: 700, marginTop: '2px', color: 'var(--primary-500)' }}>{selectedTask.status}</div>
                </div>
              </div>

              {/* Status Transition Buttons */}
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Update Task Status
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  {(['DUE_TODAY', 'PENDING_REVIEW', 'PENDING_APPROVAL', 'COMPLETED'] as TaskStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateTaskStatus(selectedTask.id, st);
                        setSelectedTask({ ...selectedTask, status: st });
                      }}
                      className={selectedTask.status === st ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNewTaskModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Assign New Compliance Task</h3>
              <button onClick={() => setIsNewTaskModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify GSTR-3B ITC against Table 4(A)(5)"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Task instructions and required evidence..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Task Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as any)}
                    className="input-field select-field"
                    style={{ marginTop: '4px' }}
                  >
                    <option value="GST_FILING">GST Filing</option>
                    <option value="TDS_RETURN">TDS Return</option>
                    <option value="RECONCILIATION">Reconciliation</option>
                    <option value="AUDIT_REVIEW">Audit Review</option>
                    <option value="JOURNAL_APPROVAL">Journal Approval</option>
                    <option value="NOTICE_RESPONSE">Notice Response</option>
                    <option value="PERIOD_CLOSE">Period Close</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="input-field select-field"
                    style={{ marginTop: '4px' }}
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Target Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsNewTaskModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
