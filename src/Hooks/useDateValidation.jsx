import { useState, useCallback } from 'react'; 

function useDateValidation() {
    const [errorMessage, setErrorMessage] = useState({});
    
    const validateStartDate = useCallback((startDate) => {
        if(!startDate) return 'Дата начала обязательна';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(startDate);
        if(start < today) {
            return 'Дата начала не может быть в прошлом';
        }
        return '';
    }, []);
    
    const validateEndDate = useCallback((startDate, endDate) => {
        if(!endDate) return 'Дата окончания обязательна';
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if(end < today) {
            return 'Дата окончания не может быть в прошлом';
        }
        
        if(startDate) {
            const start = new Date(startDate); 
            if(end <= start) { 
                return 'Дата окончания должна быть после даты начала';
            }
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if(diffDays > 730) {
                return 'Период между датами не может превышать 2 года';
            }
            
            if(diffDays < 1) {
                return 'Период между датами должен быть не менее 1 дня';
            }
        }
        
        return '';
    }, []);
    
    const validatePlanDates = useCallback((data) => { 
        const newErrors = {};
        
        newErrors.startDate = validateStartDate(data.startDate);
        newErrors.endDate = validateEndDate(data.startDate, data.endDate);
        
        if(data.hoursPerWeek) { 
            const hours = parseInt(data.hoursPerWeek);
            if(hours < 1 || hours > 40) {
                newErrors.hoursPerWeek = 'Часы в неделю должны быть от 1 до 40';
            }
        }
        
        if(data.milestones) { 
            data.milestones.forEach((milestone, index) => { 
                if(milestone.date) {
                    const milestoneDate = new Date(milestone.date);
                    const start = data.startDate ? new Date(data.startDate) : null;
                    const end = data.endDate ? new Date(data.endDate) : null;
                    
                    if(start && milestoneDate < start) {
                        newErrors[`milestone_${index}`] = 'Дата вехи не может быть раньше даты начала';
                    }
                    
                    if(end && milestoneDate > end) {
                        newErrors[`milestone_${index}`] = 'Дата вехи не может быть позже даты окончания';
                    }
                }
            });
        }
        
        setErrorMessage(newErrors);
        return Object.values(newErrors).every(error => error === '');
    }, [validateEndDate, validateStartDate]);
    
    return {
        errorMessage,
        validatePlanDates, 
        clearErrors: () => setErrorMessage({})
    };
}

export default useDateValidation;