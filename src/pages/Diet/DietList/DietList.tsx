import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import ItemCard from '../../../components/common/ItemCard/ItemCard';
import ErrorContainer from '../../../components/common/ErrorContainer/ErrorContainer';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import SelectionGrid, { SelectionGridItem } from '../../../components/common/SelectionGrid/SelectionGrid';
import { useEntityList } from '../../../hooks/useEntityList';
import { DatabaseService, Diet } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import { getMealIcon } from '../../../utils/iconHelpers';
import './DietList.css';

const DietList: React.FC = () => {
  const navigate = useNavigate();

  const {
    items: diets,
    loading,
    error,
    selectedDate,
    loadItems: loadDiets,
  } = useEntityList<Diet>({
    loadEntities: DatabaseService.getDiets,
    entityName: 'diet entries',
  });


  const handleMealTypeClick = (item: SelectionGridItem) => {
    navigate('/diet/entry', {
      state: { 
        selectedDate: formatDate(selectedDate),
        mealType: item.name
      },
    });
  };

  const handleDietClick = (diet: Diet) => {
    navigate(`/diet/${diet.id}`, {
      state: { selectedDate: formatDate(selectedDate) },
    });
  };


  const mealTypes: SelectionGridItem[] = [
    { id: 'breakfast', name: 'Breakfast', icon: getMealIcon('Breakfast'), color: '#FF9800' },
    { id: 'lunch', name: 'Lunch', icon: getMealIcon('Lunch'), color: '#4CAF50' },
    { id: 'snacks', name: 'Snacks', icon: getMealIcon('Snacks'), color: '#FF5722' },
    { id: 'dinner', name: 'Dinner', icon: getMealIcon('Dinner'), color: '#9C27B0' }
  ];

  return (
    <div className="diet-list-page">
      <Header />

      <main className="diet-list-main">
        <div className="diet-list-content">
          <PageHeader
            title="Diet"
            onBack={() => navigate('/create')}
          />

          {loading ? (
            <div className="loading-container">
              <LoadingSpinner text="Loading diet entries..." />
            </div>
          ) : error ? (
            <ErrorContainer message={error} onRetry={loadDiets} />
          ) : (
            <>
              {/* Meal Type Selection */}
              <SelectionGrid
                items={mealTypes}
                onItemClick={handleMealTypeClick}
                title="Select Meal Type"
                columns={4}
              />

              {/* Today's Diet Entries */}
              {diets.length > 0 ? (
                <div className="logged-diets-section">
                  <h3 className="section-title">Today's Meals</h3>
                  <div className="diets-list">
                    {diets.map(diet => (
                      <ItemCard
                        key={diet.id}
                        icon={getMealIcon(diet.mealType)}
                        title={diet.mealType}
                        onClick={() => handleDietClick(diet)}
                        details={
                          <>
                            <span className="diet-calories">{diet.calories} cal</span>
                            {diet.foodItems && (
                              <span className="diet-food-items">
                                {diet.foodItems}
                              </span>
                            )}
                            {diet.notes && <p className="diet-notes">{diet.notes}</p>}
                          </>
                        }
                        className="diet-card"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  message={`No meals logged for ${formatDate(selectedDate)} yet. Select a meal type above to get started!`}
                />
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default DietList;
