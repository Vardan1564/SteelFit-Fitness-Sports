from django.contrib import admin
from .models import Products, ProductImage, Booking, Feedback, Categories

# 🔹 Category Admin
@admin.register(Categories)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

# 🔹 Inline for multiple images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


# 🔹 Product Admin
@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_categories', 'original_price', 'discount_price', 'is_in_stock']
    list_filter = ['category', 'is_in_stock']
    search_fields = ['name']
    inlines = [ProductImageInline]

    def get_categories(self, obj):
        return ", ".join([c.name for c in obj.category.all()])

    get_categories.short_description = "Categories"



# 🔹 Product Image Admin
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'created_at']
    # extra = 4


# 🔹 Booking Admin
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['user__username', 'product__name']
    list_editable = ['status']


# 🔹 Feedback Admin
@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'rating', 'created_at']
    list_filter = ['rating']
    search_fields = ['user__username', 'product__name']