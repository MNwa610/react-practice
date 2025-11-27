import {useEffect, useState} from 'react';
import useDateValidation from '../Hooks/useDateValidation';

function StudyTimelineForm({technology, onSave, onCancel}) {
    const [formData, setFormData] = useState({
        technologyId: technology.id,
        startDate: '',
        endDate: '',
        hoursPerWeek: '',
        milestones: [{title:'', date: '', completed: false}],
    });
    const {validatePlanDates, errorMessage, clearErrors} = useDateValidation();
    const [touched, setTouched] = useState({});
    
    useEffect(() => {
        if(technology?.StudyTimeline){
            setFormData(prev =>({
                ...prev,
                ...technology.StudyTimeline,
                milestones: technology.StudyTimeline.milestones || [{title:'', date: '', completed: false}]
            }));
        }
    },[technology]);
    
    const handleInputChange = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}));
        if(touched[field]) {
            validatePlanDates({...formData, [field]: value});
        }
    };
    
    const handleMilestoneChange = (index, field, value) => {
        const updatedMilestones = formData.milestones.map((milestone, i) => 
            i === index ? {...milestone, [field]: value} : milestone
        );
        setFormData(prev => ({...prev, milestones: updatedMilestones}));
    };
    
    const handleAddMilestone = () => {
        setFormData(prev => ({
            ...prev,
            milestones: [...prev.milestones, {title:'', date: '', completed: false}]
        }));
    };
    
    const handleRemoveMilestone = (index) => {
        if(formData.milestones.length > 1){
            const updatedMilestones = formData.milestones.filter((_, i) => i !== index);
            setFormData(prev => ({...prev, milestones: updatedMilestones}));
        }
    };
    
    const handleBlur = (field) => {
        setTouched(prev => ({...prev, [field]: true}));
        validatePlanDates(formData);
    };
    
    const calculateStats = () => {
        if (!formData.startDate || !formData.endDate) {
            return { totalDays: 0, totalWeeks: 0, totalHours: 0 };
        }
        
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = end - start;
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.ceil(totalDays / 7);
        const totalHours = totalWeeks * (parseInt(formData.hoursPerWeek) || 0);
        return {totalDays, totalWeeks, totalHours};
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const allTouched = {
            startDate: true,
            endDate: true,
            hoursPerWeek: true,
            ...formData.milestones.reduce((acc, _, index) => {
                acc[`milestone_${index}`] = true;
                return acc;
            }, {})
        };
        
        setTouched(allTouched);
        
        if(validatePlanDates(formData)) {
            const stats = calculateStats();
            onSave({
                ...formData,
                hoursPerWeek: parseInt(formData.hoursPerWeek) || 0,
                stats,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
    };

    const hasErrors = Object.values(errorMessage).some(msg => msg !== '');
    const isFormValid = !hasErrors && formData.startDate && formData.endDate && formData.hoursPerWeek;

    return (
        <div className="study-timeline-form">
        <div className="form-header">
            <h3>Установить сроки изучения</h3>
            <p>Планируйте изучение технологии "{technology?.title}"</p>
        </div>

        <form onSubmit={handleSubmit} className="timeline-form">
            
            <div className="form-section">
            <h4>Основные сроки</h4>
            <div className="form-row">
                <div className="form-group">
                <label htmlFor="startDate">
                    Дата начала *
                    {touched.startDate && errorMessage.startDate && (
                    <span className="error-text"> - {errorMessage.startDate}</span>
                    )}
                </label>
                <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    onBlur={() => handleBlur('startDate')}
                    className={touched.startDate && errorMessage.startDate ? 'error' : ''}
                    min={new Date().toISOString().split('T')[0]}
                />
                </div>

                <div className="form-group">
                <label htmlFor="endDate">
                    Дата окончания *
                    {touched.endDate && errorMessage.endDate && (
                    <span className="error-text"> - {errorMessage.endDate}</span>
                    )}
                </label>
                <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    onBlur={() => handleBlur('endDate')}
                    className={touched.endDate && errorMessage.endDate ? 'error' : ''}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                <label htmlFor="hoursPerWeek">
                    Часов в неделю *
                    {touched.hoursPerWeek && errorMessage.hoursPerWeek && (
                    <span className="error-text"> - {errorMessage.hoursPerWeek}</span>
                    )}
                </label>
                <input
                    type="number"
                    id="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={(e) => handleInputChange('hoursPerWeek', e.target.value)}
                    onBlur={() => handleBlur('hoursPerWeek')}
                    className={touched.hoursPerWeek && errorMessage.hoursPerWeek ? 'error' : ''}
                    min="1"
                    max="40"
                    placeholder="Например: 10"
                />
                </div>

                <div className="form-group">
                <label htmlFor="priority">Приоритет</label>
                <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                    <option value="critical">Критический</option>
                </select>
                </div>
            </div>
            </div>

            <div className="form-section">
            <div className="section-header">
                <h4> Вехи изучения </h4>
                <button type="button" onClick={handleAddMilestone} className="btn btn-outline btn-sm">
                + Добавить веху
                </button>
            </div>
            
            <div className="milestones-list">
                {formData.milestones.map((milestone, index) => (
                <div key={index} className="milestone-item">
                    <div className="milestone-header">
                    <span className="milestone-number">#{index + 1}</span>
                    {formData.milestones.length > 1 && (
                        <button
                        type="button"
                        onClick={() => handleRemoveMilestone(index)}
                        className="btn btn-danger btn-sm"
                        >
                        ✕
                        </button>
                    )}
                    </div>
                    
                    <div className="milestone-content">
                    <div className="form-group">
                        <label htmlFor={`milestone-title-${index}`}>
                        Название вехи
                        {touched[`milestone_${index}`] && errorMessage[`milestone_${index}`] && (
                            <span className="error-text"> - {errorMessage[`milestone_${index}`]}</span>
                        )}
                        </label>
                        <input
                        type="text"
                        id={`milestone-title-${index}`}
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                        placeholder="Например: 'Освоить базовый синтаксис'"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor={`milestone-date-${index}`}>Дата выполнения</label>
                        <input
                        type="date"
                        id={`milestone-date-${index}`}
                        value={milestone.date}
                        onChange={(e) => handleMilestoneChange(index, 'date', e.target.value)}
                        onBlur={() => handleBlur(`milestone_${index}`)}
                        min={formData.startDate}
                        max={formData.endDate}
                        className={touched[`milestone_${index}`] && errorMessage[`milestone_${index}`] ? 'error' : ''}
                        />
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

            <div className="form-actions">
            <button
                type="submit"
                className="btn btn-primary"
                disabled={!isFormValid}
            >
                 Сохранить план
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
            >
                Отмена
            </button>
            <button
                type="button"
                onClick={clearErrors}
                className="btn btn-outline"
            >
                Очистить ошибки
            </button>
            </div>

            {hasErrors && (
            <div className="validation-summary">
                <h4>Исправьте ошибки:</h4>
                <ul>
                {Object.entries(errorMessage).map(([field, error]) => 
                    error && <li key={field}>{error}</li>
                )}
                </ul>
            </div>
            )}
        </form>
        </div>
    );
}

export default StudyTimelineForm;