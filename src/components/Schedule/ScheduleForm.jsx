import { useState, useEffect } from 'react'
import { useSchedule } from './ScheduleContext'
import { diasSemana } from '../../data/data'
import {
    ChevronLeft, Check, Plus, Clock, X, ArrowRight,
    Calendar, Building2, BookOpen, GraduationCap, User, ExternalLink
} from 'lucide-react'

const inp = "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:border-indigo-400 transition-all text-sm placeholder-gray-400"
const lbl = "block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2"

const STEPS = [
    { id: 1, label: 'Período e horário', icon: Calendar },
    { id: 2, label: 'Sala',              icon: Building2 },
    { id: 3, label: 'Disciplina',        icon: BookOpen },
    { id: 4, label: 'Professor',         icon: User },
    { id: 5, label: 'Confirmação',       icon: Check },
]

const ScheduleForm = ({ horarioEdit, onSave, onCancel, onGoToCadastros, restoreDraft }) => {
    const { cursos, salas, periodos, professores, disciplinas } = useSchedule()
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({
        periodoId: '', dataInicio: '', dataFim: '',
        diaSemana: '', horarioInicio: '', horarioFim: '',
        salaId: '', disciplinaId: '', cursoId: '', professorId: '',
    })

    // Restaura rascunho ao voltar do Cadastros
    useEffect(() => {
        if (!restoreDraft || horarioEdit) return
        const draft = sessionStorage.getItem('scheduleFormDraft')
        const draftStep = sessionStorage.getItem('scheduleFormStep')
        if (draft) {
            try {
                setForm(JSON.parse(draft))
                if (draftStep) setStep(parseInt(draftStep))
            } catch {}
            sessionStorage.removeItem('scheduleFormDraft')
            sessionStorage.removeItem('scheduleFormStep')
        }
    }, [restoreDraft])

    useEffect(() => {
        if (horarioEdit) {
            const p = periodos.find(p => p.id === horarioEdit.periodoId)
            setForm({
                periodoId:     String(horarioEdit.periodoId || ''),
                dataInicio:    horarioEdit.dataInicio   || p?.dataInicio || '',
                dataFim:       horarioEdit.dataFim      || p?.dataFim    || '',
                diaSemana:     horarioEdit.diaSemana    || '',
                horarioInicio: horarioEdit.horarioInicio || '',
                horarioFim:    horarioEdit.horarioFim   || '',
                salaId:        String(horarioEdit.salaId        || ''),
                disciplinaId:  String(horarioEdit.disciplinaId  || horarioEdit.disciplina?.id || ''),
                cursoId:       String(horarioEdit.cursoId       || ''),
                professorId:   String(horarioEdit.professorId   || horarioEdit.professor?.id  || ''),
            })
        }
    }, [horarioEdit, periodos])

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handlePeriodo = (id) => {
        const p = periodos.find(p => p.id === parseInt(id))
        setForm(f => ({ ...f, periodoId: id, dataInicio: p?.dataInicio || '', dataFim: p?.dataFim || '' }))
    }

    // Salva rascunho e redireciona para Cadastros na aba correta
    const handleGoTo = (tab) => {
        sessionStorage.setItem('scheduleFormDraft', JSON.stringify(form))
        sessionStorage.setItem('scheduleFormStep', String(step))
        onGoToCadastros(tab)
    }

    const canNext = () => {
        if (step === 1) return form.periodoId && form.diaSemana && form.horarioInicio && form.horarioFim && form.dataInicio && form.dataFim
        if (step === 2) return form.salaId
        if (step === 3) return form.disciplinaId && form.cursoId
        if (step === 4) return form.professorId
        return true
    }

    const handleSubmit = () => {
        if (form.horarioInicio >= form.horarioFim) { alert('O horário de término deve ser maior que o de início.'); return }
        onSave({
            cursoId: parseInt(form.cursoId), salaId: parseInt(form.salaId),
            professorId: parseInt(form.professorId), disciplinaId: parseInt(form.disciplinaId),
            periodoId: parseInt(form.periodoId), diaSemana: form.diaSemana,
            horarioInicio: form.horarioInicio, horarioFim: form.horarioFim,
            dataInicio: new Date(form.dataInicio).toISOString(),
            dataFim:    new Date(form.dataFim).toISOString(),
        })
    }

    const getPeriodo    = () => periodos.find(p => p.id    === parseInt(form.periodoId))
    const getSala       = () => salas.find(s => s.id       === parseInt(form.salaId))
    const getDisciplina = () => disciplinas.find(d => d.id === parseInt(form.disciplinaId))
    const getCurso      = () => cursos.find(c => c.id      === parseInt(form.cursoId))
    const getProfessor  = () => professores.find(p => p.id === parseInt(form.professorId))
    const cur = STEPS[step - 1]
    const StepIcon = cur.icon

    const CadastrarBtn = ({ label, tab }) => (
        <button type="button" onClick={() => handleGoTo(tab)}
            className="shrink-0 h-11 px-4 flex items-center gap-1.5 rounded-xl border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-xs font-semibold whitespace-nowrap">
            <Plus size={12} />
            {label}
            <ExternalLink size={10} className="opacity-50 ml-0.5" />
        </button>
    )

    const PreviewCard = ({ icon: Icon, title, subtitle }) => (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Icon size={16} className="text-indigo-600" />
            </div>
            <div className="flex-1">
                <p className="font-bold text-indigo-900 text-sm">{title}</p>
                {subtitle && <p className="text-xs text-indigo-400 mt-0.5">{subtitle}</p>}
            </div>
            <Check size={15} className="text-indigo-500" />
        </div>
    )

    return (
        <div className="rounded-2xl overflow-hidden mb-8"
            style={{ border: '1px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

            {/* Cabeçalho */}
            <div className="px-8 py-6 flex items-center justify-between"
                style={{ background: 'linear-gradient(135deg, #1c1aa3 0%, #150355 100%)' }}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                        <StepIcon size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="text-blue-300/80 text-[10px] font-bold uppercase tracking-widest">
                            {horarioEdit ? 'Editar Horário' : 'Novo Horário'} · Passo {step}/{STEPS.length}
                        </p>
                        <h3 className="text-white text-xl font-black leading-tight mt-0.5">{cur.label}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        {STEPS.map(s => (
                            <div key={s.id} className="rounded-full transition-all duration-300"
                                style={{
                                    width: step === s.id ? '22px' : '8px', height: '8px',
                                    background: step > s.id ? 'rgba(255,255,255,0.85)' : step === s.id ? 'white' : 'rgba(255,255,255,0.2)',
                                }} />
                        ))}
                    </div>
                    <button onClick={onCancel}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all">
                        <X size={15} />
                    </button>
                </div>
            </div>

            {/* Corpo */}
            <div className="bg-white px-8 py-8 space-y-6">

                {step === 1 && <>
                    <div>
                        <label className={lbl}>Período letivo</label>
                        <div className="flex gap-2">
                            <select className={inp} value={form.periodoId} onChange={e => handlePeriodo(e.target.value)}>
                                <option value="">Selecione o período...</option>
                                {periodos.map(p => <option key={p.id} value={p.id}>{p.semestre} — {p.descricao}</option>)}
                            </select>
                            <CadastrarBtn label="Cadastrar período" tab="periodos" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div><label className={lbl}>Data de início</label><input type="date" className={inp} value={form.dataInicio} onChange={e => set('dataInicio', e.target.value)} /></div>
                        <div><label className={lbl}>Data de fim</label><input type="date" className={inp} value={form.dataFim} onChange={e => set('dataFim', e.target.value)} /></div>
                    </div>
                    <div>
                        <label className={lbl}>Dia da semana</label>
                        <div className="grid grid-cols-6 gap-2">
                            {diasSemana.map(d => (
                                <button key={d} type="button" onClick={() => set('diaSemana', d)}
                                    className="py-3 rounded-xl text-xs font-bold border-2 transition-all"
                                    style={form.diaSemana === d
                                        ? { background: 'linear-gradient(135deg,#1c1aa3,#4f46e5)', color: 'white', borderColor: 'transparent', boxShadow: '0 4px 14px rgba(28,26,163,0.3)' }
                                        : { borderColor: '#e5e7eb', color: '#9ca3af', background: 'white' }}>
                                    {d.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={lbl}><Clock size={11} className="inline mr-1 -mt-0.5" />Horário de início</label>
                            <input type="time" className={inp} value={form.horarioInicio} onChange={e => set('horarioInicio', e.target.value)} />
                        </div>
                        <div>
                            <label className={lbl}><Clock size={11} className="inline mr-1 -mt-0.5" />Horário de término</label>
                            <input type="time" className={inp} value={form.horarioFim} onChange={e => set('horarioFim', e.target.value)} />
                        </div>
                    </div>
                </>}

                {step === 2 && <>
                    <div>
                        <label className={lbl}>Sala ou laboratório</label>
                        <div className="flex gap-2">
                            <select className={inp} value={form.salaId} onChange={e => set('salaId', e.target.value)}>
                                <option value="">Selecione a sala...</option>
                                {salas.map(s => <option key={s.id} value={s.id}>{s.nome} — {s.tipo}</option>)}
                            </select>
                            <CadastrarBtn label="Cadastrar sala" tab="salas" />
                        </div>
                    </div>
                    {form.salaId && getSala() && <PreviewCard icon={Building2} title={getSala().nome} subtitle={getSala().tipo} />}
                </>}

                {step === 3 && <>
                    <div>
                        <label className={lbl}>Disciplina</label>
                        <div className="flex gap-2">
                            <select className={inp} value={form.disciplinaId} onChange={e => set('disciplinaId', e.target.value)}>
                                <option value="">Selecione a disciplina...</option>
                                {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                            </select>
                            <CadastrarBtn label="Cadastrar disciplina" tab="disciplinas" />
                        </div>
                    </div>
                    <div>
                        <label className={lbl}>Curso</label>
                        <div className="flex gap-2">
                            <select className={inp} value={form.cursoId} onChange={e => set('cursoId', e.target.value)}>
                                <option value="">Selecione o curso...</option>
                                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}{c.sigla ? ` (${c.sigla})` : ''}</option>)}
                            </select>
                            <CadastrarBtn label="Cadastrar curso" tab="cursos" />
                        </div>
                    </div>
                    {form.cursoId && getCurso() && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="w-4 h-4 rounded-full shrink-0" style={{ background: getCurso().cor }} />
                            <p className="text-sm font-semibold text-gray-700">{getCurso().nome}{getCurso().sigla && <span className="text-gray-400 font-normal"> ({getCurso().sigla})</span>}</p>
                        </div>
                    )}
                </>}

                {step === 4 && <>
                    <div>
                        <label className={lbl}>Professor responsável</label>
                        <div className="flex gap-2">
                            <select className={inp} value={form.professorId} onChange={e => set('professorId', e.target.value)}>
                                <option value="">Selecione o professor...</option>
                                {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                            </select>
                            <CadastrarBtn label="Cadastrar professor" tab="professores" />
                        </div>
                    </div>
                    {form.professorId && getProfessor() && <PreviewCard icon={User} title={getProfessor().nome} subtitle={getProfessor().email} />}
                </>}

                {step === 5 && (
                    <div>
                        <p className="text-sm text-gray-500 mb-5">Revise os dados antes de salvar.</p>
                        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                            {[
                                { Icon: Calendar,      label: 'Período',    v: getPeriodo()?.semestre },
                                { Icon: Clock,         label: 'Dia/Horário',v: `${form.diaSemana}, ${form.horarioInicio} – ${form.horarioFim}` },
                                { Icon: Building2,     label: 'Sala',       v: getSala()?.nome },
                                { Icon: BookOpen,      label: 'Disciplina', v: getDisciplina()?.nome },
                                { Icon: GraduationCap, label: 'Curso',      v: getCurso() ? `${getCurso().nome}${getCurso().sigla ? ` (${getCurso().sigla})` : ''}` : '' },
                                { Icon: User,          label: 'Professor',  v: getProfessor()?.nome },
                            ].map(({ Icon, label, v }) => (
                                <div key={label} className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                        <Icon size={14} className="text-gray-500" />
                                    </div>
                                    <span className="text-xs text-gray-400 w-20 shrink-0">{label}</span>
                                    <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{v || '—'}</span>
                                    <Check size={13} className="text-green-500 shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Rodapé */}
            <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/70 flex justify-between items-center">
                <button type="button" onClick={() => step > 1 ? setStep(s => s - 1) : onCancel()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 text-sm font-semibold hover:bg-gray-200 transition-colors">
                    <ChevronLeft size={15} />{step === 1 ? 'Cancelar' : 'Voltar'}
                </button>
                {step < 5
                    ? <button type="button" disabled={!canNext()} onClick={() => setStep(s => s + 1)}
                        className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg,#1c1aa3,#4f46e5)', boxShadow: canNext() ? '0 4px 16px rgba(28,26,163,0.28)' : 'none' }}>
                        Continuar <ArrowRight size={15} />
                      </button>
                    : <button type="button" onClick={handleSubmit}
                        className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-white text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 4px 16px rgba(22,163,74,0.25)' }}>
                        <Check size={15} />{horarioEdit ? 'Atualizar Horário' : 'Salvar Horário'}
                      </button>
                }
            </div>
        </div>
    )
}

export default ScheduleForm