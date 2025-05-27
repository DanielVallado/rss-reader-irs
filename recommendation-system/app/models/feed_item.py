from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List

@dataclass
class Category:
    """Modelo para representar una categoría"""
    id: int
    name: str

@dataclass
class RssFeed:
    """Modelo para representar un feed RSS"""
    id: int
    url: str
    created_at: datetime

@dataclass
class Article:
    """Modelo para representar un artículo de RSS"""
    id: int
    rss_id: int
    title: str
    link: str
    published_at: Optional[datetime]
    description: Optional[str] = None
    image_url: Optional[str] = None
    author: Optional[str] = None
    categories: List[Category] = None
    
    def __post_init__(self):
        if self.categories is None:
            self.categories = []
    
    def to_dict(self) -> dict:
        """Convertir el objeto a diccionario"""
        return {
            'id': self.id,
            'rss_id': self.rss_id,
            'title': self.title,
            'link': self.link,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'description': self.description,
            'image_url': self.image_url,
            'author': self.author,
            'categories': [cat.name for cat in self.categories] if self.categories else []
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Article':
        """Crear un objeto Article desde un diccionario"""
        if 'published_at' in data and data['published_at']:
            data['published_at'] = datetime.fromisoformat(data['published_at'])
        
        # Manejar las categorías si están presentes
        categories = data.pop('categories', [])
        article = cls(**data)
        
        # Convertir nombres de categorías a objetos Category si es necesario
        if categories and isinstance(categories[0], str):
            article.categories = [Category(id=0, name=cat) for cat in categories]
        else:
            article.categories = categories
            
        return article 